// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

import {
    DeckConfig_Config_LeechAction,
    DeckConfig_Config_NewCardGatherPriority,
    DeckConfig_Config_NewCardInsertOrder,
    DeckConfig_Config_NewCardSortOrder,
    DeckConfig_Config_ReviewCardOrder,
    DeckConfig_Config_ReviewMix,
} from "@tslib/anki/deck_config_pb";
import * as tr from "@tslib/ftl";
import type { Choice } from "components/EnumSelector.svelte";

export function newGatherPriorityChoices(): Choice<DeckConfig_Config_NewCardGatherPriority>[] {
    return [
        {
            label: tr.deckConfigNewGatherPriorityDeck(),
            value: DeckConfig_Config_NewCardGatherPriority.DECK,
        },
        {
            label: tr.deckConfigNewGatherPriorityPositionLowestFirst(),
            value: DeckConfig_Config_NewCardGatherPriority.LOWEST_POSITION,
        },
        {
            label: tr.deckConfigNewGatherPriorityPositionHighestFirst(),
            value: DeckConfig_Config_NewCardGatherPriority.HIGHEST_POSITION,
        },
        {
            label: tr.deckConfigNewGatherPriorityRandomNotes(),
            value: DeckConfig_Config_NewCardGatherPriority.RANDOM_NOTES,
        },
        {
            label: tr.deckConfigNewGatherPriorityRandomCards(),
            value: DeckConfig_Config_NewCardGatherPriority.RANDOM_CARDS,
        },
    ];
}

export function newSortOrderChoices(): Choice<DeckConfig_Config_NewCardSortOrder>[] {
    return [
        {
            label: tr.deckConfigSortOrderTemplateThenGather(),
            value: DeckConfig_Config_NewCardSortOrder.TEMPLATE,
        },
        {
            label: tr.deckConfigSortOrderGather(),
            value: DeckConfig_Config_NewCardSortOrder.NO_SORT,
        },
        {
            label: tr.deckConfigSortOrderCardTemplateThenRandom(),
            value: DeckConfig_Config_NewCardSortOrder.TEMPLATE_THEN_RANDOM,
        },
        {
            label: tr.deckConfigSortOrderRandomNoteThenTemplate(),
            value: DeckConfig_Config_NewCardSortOrder.RANDOM_NOTE_THEN_TEMPLATE,
        },
        {
            label: tr.deckConfigSortOrderRandom(),
            value: DeckConfig_Config_NewCardSortOrder.RANDOM_CARD,
        },
    ];
}

export function reviewOrderChoices(): Choice<DeckConfig_Config_ReviewCardOrder>[] {
    return [
        {
            label: tr.deckConfigSortOrderDueDateThenRandom(),
            value: DeckConfig_Config_ReviewCardOrder.DAY,
        },
        {
            label: tr.deckConfigSortOrderDueDateThenDeck(),
            value: DeckConfig_Config_ReviewCardOrder.DAY_THEN_DECK,
        },
        {
            label: tr.deckConfigSortOrderDeckThenDueDate(),
            value: DeckConfig_Config_ReviewCardOrder.DECK_THEN_DAY,
        },
        {
            label: tr.deckConfigSortOrderAscendingIntervals(),
            value: DeckConfig_Config_ReviewCardOrder.INTERVALS_ASCENDING,
        },
        {
            label: tr.deckConfigSortOrderDescendingIntervals(),
            value: DeckConfig_Config_ReviewCardOrder.INTERVALS_DESCENDING,
        },
        {
            label: tr.deckConfigSortOrderAscendingEase(),
            value: DeckConfig_Config_ReviewCardOrder.EASE_ASCENDING,
        },
        {
            label: tr.deckConfigSortOrderDescendingEase(),
            value: DeckConfig_Config_ReviewCardOrder.EASE_DESCENDING,
        },
        {
            label: tr.deckConfigSortOrderRelativeOverdueness(),
            value: DeckConfig_Config_ReviewCardOrder.RELATIVE_OVERDUENESS,
        },
        {
            label: tr.deckConfigSortOrderRandom(),
            value: DeckConfig_Config_ReviewCardOrder.RANDOM,
        },
    ];
}

export function reviewMixChoices(): Choice<DeckConfig_Config_ReviewMix>[] {
    return [
        {
            label: tr.deckConfigReviewMixMixWithReviews(),
            value: DeckConfig_Config_ReviewMix.MIX_WITH_REVIEWS,
        },
        {
            label: tr.deckConfigReviewMixShowAfterReviews(),
            value: DeckConfig_Config_ReviewMix.AFTER_REVIEWS,
        },
        {
            label: tr.deckConfigReviewMixShowBeforeReviews(),
            value: DeckConfig_Config_ReviewMix.BEFORE_REVIEWS,
        },
    ];
}

export function leechChoices(): Choice<DeckConfig_Config_LeechAction>[] {
    return [
        {
            label: tr.actionsSuspendCard(),
            value: DeckConfig_Config_LeechAction.SUSPEND,
        },
        {
            label: tr.schedulingTagOnly(),
            value: DeckConfig_Config_LeechAction.TAG_ONLY,
        },
    ];
}

export function newInsertOrderChoices(): Choice<DeckConfig_Config_NewCardInsertOrder>[] {
    return [
        {
            label: tr.deckConfigNewInsertionOrderSequential(),
            value: DeckConfig_Config_NewCardInsertOrder.DUE,
        },
        {
            label: tr.deckConfigNewInsertionOrderRandom(),
            value: DeckConfig_Config_NewCardInsertOrder.RANDOM,
        },
    ];
}
