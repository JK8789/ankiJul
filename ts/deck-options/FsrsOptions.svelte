<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import {
        ComputeRetentionProgress,
        type ComputeWeightsProgress,
    } from "@tslib/anki/collection_pb";
    import { ComputeOptimalRetentionRequest } from "@tslib/anki/scheduler_pb";
    import {
        computeFsrsWeights,
        computeOptimalRetention,
        evaluateWeights,
        setWantsAbort,
    } from "@tslib/backend";
    import * as tr from "@tslib/ftl";
    import { runWithBackendProgress } from "@tslib/progress";

    import SettingTitle from "../components/SettingTitle.svelte";
    import type { DeckOptionsState } from "./lib";
    import SpinBoxFloatRow from "./SpinBoxFloatRow.svelte";
    import Warning from "./Warning.svelte";
    import WeightsInputRow from "./WeightsInputRow.svelte";

    export let state: DeckOptionsState;

    const config = state.currentConfig;
    const defaults = state.defaults;

    let computeWeightsProgress: ComputeWeightsProgress | undefined;
    let computeWeightsWarning = "";
    let customSearch = "";
    let computing = false;

    let computeRetentionProgress:
        | ComputeWeightsProgress
        | ComputeRetentionProgress
        | undefined;

    const optimalRetentionRequest = new ComputeOptimalRetentionRequest({
        deckSize: 10000,
        daysToSimulate: 365,
        maxSecondsOfStudyPerDay: 1800,
    });
    async function computeWeights(): Promise<void> {
        if (computing) {
            await setWantsAbort({});
            return;
        }
        computing = true;
        try {
            await runWithBackendProgress(
                async () => {
                    const search = customSearch ?? `preset:"${state.getCurrentName()}"`;
                    const resp = await computeFsrsWeights({
                        search,
                    });
                    if (computeWeightsProgress) {
                        computeWeightsProgress.current = computeWeightsProgress.total;
                    }
                    if (resp.fsrsItems < 1000) {
                        computeWeightsWarning = tr.deckConfigLimitedHistory({
                            count: resp.fsrsItems,
                        });
                    } else {
                        computeWeightsWarning = "";
                    }
                    $config.fsrsWeights = resp.weights;
                },
                (progress) => {
                    if (progress.value.case === "computeWeights") {
                        computeWeightsProgress = progress.value.value;
                    }
                },
            );
        } finally {
            computing = false;
        }
    }

    async function checkWeights(): Promise<void> {
        if (computing) {
            await setWantsAbort({});
            return;
        }
        computing = true;
        try {
            await runWithBackendProgress(
                async () => {
                    const search = customSearch ?? `preset:"${state.getCurrentName()}"`;
                    const resp = await evaluateWeights({
                        weights: $config.fsrsWeights,
                        search,
                    });
                    if (computeWeightsProgress) {
                        computeWeightsProgress.current = computeWeightsProgress.total;
                    }
                    setTimeout(
                        () =>
                            alert(
                                `Log loss: ${resp.logLoss.toFixed(
                                    3,
                                )}, RMSE(bins): ${resp.rmseBins.toFixed(
                                    3,
                                )}. ${tr.deckConfigSmallerIsBetter()}`,
                            ),
                        200,
                    );
                },
                (progress) => {
                    if (progress.value.case === "computeWeights") {
                        computeWeightsProgress = progress.value.value;
                    }
                },
            );
        } finally {
            computing = false;
        }
    }

    async function computeRetention(): Promise<void> {
        if (computing) {
            await setWantsAbort({});
            return;
        }
        computing = true;
        try {
            await runWithBackendProgress(
                async () => {
                    optimalRetentionRequest.maxInterval = $config.maximumReviewInterval;
                    optimalRetentionRequest.weights = $config.fsrsWeights;
                    optimalRetentionRequest.search = `preset:"${state.getCurrentName()}"`;
                    const resp = await computeOptimalRetention(optimalRetentionRequest);
                    $config.desiredRetention = resp.optimalRetention;
                    if (computeRetentionProgress) {
                        computeRetentionProgress.current =
                            computeRetentionProgress.total;
                    }
                },
                (progress) => {
                    if (progress.value.case === "computeRetention") {
                        computeRetentionProgress = progress.value.value;
                    }
                },
            );
        } finally {
            computing = false;
        }
    }

    $: computeWeightsProgressString = renderWeightProgress(computeWeightsProgress);
    $: computeRetentionProgressString = renderRetentionProgress(
        computeRetentionProgress,
    );

    function renderWeightProgress(val: ComputeWeightsProgress | undefined): String {
        if (!val || !val.total) {
            return "";
        }
        let pct = ((val.current / val.total) * 100).toFixed(2);
        pct = `${pct}%`;
        if (val instanceof ComputeRetentionProgress) {
            return pct;
        } else {
            return `${pct} of ${val.fsrsItems} reviews`;
        }
    }

    function renderRetentionProgress(
        val: ComputeRetentionProgress | undefined,
    ): String {
        if (!val || !val.total) {
            return "";
        }
        const pct = ((val.current / val.total) * 100).toFixed(2);
        return `${pct}%`;
    }
</script>

<SpinBoxFloatRow
    bind:value={$config.desiredRetention}
    defaultValue={defaults.desiredRetention}
    min={0.8}
    max={0.97}
>
    <SettingTitle>
        {tr.deckConfigDesiredRetention()}
    </SettingTitle>
</SpinBoxFloatRow>

<div class="ms-1 me-1">
    <WeightsInputRow bind:value={$config.fsrsWeights} defaultValue={[]}>
        <SettingTitle>{tr.deckConfigWeights()}</SettingTitle>
    </WeightsInputRow>
</div>

<div class="m-2">
    <details>
        <summary>{tr.deckConfigComputeOptimalWeights()}</summary>
        <input
            bind:value={customSearch}
            placeholder={tr.deckConfigComputeWeightsSearch()}
            class="w-100 mb-1"
        />
        <button
            class="btn {computing ? 'btn-warning' : 'btn-primary'}"
            on:click={() => computeWeights()}
        >
            {#if computing}
                {tr.actionsCancel()}
            {:else}
                {tr.deckConfigComputeButton()}
            {/if}
        </button>
        <button
            class="btn {computing ? 'btn-warning' : 'btn-primary'}"
            on:click={() => checkWeights()}
        >
            {#if computing}
                {tr.actionsCancel()}
            {:else}
                {tr.deckConfigAnalyzeButton()}
            {/if}
        </button>
        {#if computing}<div>{computeWeightsProgressString}</div>{/if}
        <Warning warning={computeWeightsWarning} />
    </details>
</div>

<div class="m-2">
    <details>
        <summary>{tr.deckConfigComputeOptimalRetention()}</summary>

        Deck size:
        <br />
        <input type="number" bind:value={optimalRetentionRequest.deckSize} />
        <br />

        Days to simulate
        <br />
        <input type="number" bind:value={optimalRetentionRequest.daysToSimulate} />
        <br />

        Max seconds of study per day:
        <br />
        <input
            type="number"
            bind:value={optimalRetentionRequest.maxSecondsOfStudyPerDay}
        />
        <br />

        <button
            class="btn {computing ? 'btn-warning' : 'btn-primary'}"
            on:click={() => computeRetention()}
        >
            {#if computing}
                {tr.actionsCancel()}
            {:else}
                {tr.deckConfigComputeButton()}
            {/if}
        </button>
        <div>{computeRetentionProgressString}</div>
    </details>
</div>

<style>
</style>
