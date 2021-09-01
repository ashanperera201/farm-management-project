import { DailyFeedActions } from '../action-types';

export const setDailyFeed = (dailyFeed: any) => ({
  type: DailyFeedActions.SET_DAILY_FEED,
  payload: dailyFeed
});

export const addDailyFeed = (dailyFeed: any) => ({
  type: DailyFeedActions.ADD_DAILY_FEED,
  payload: dailyFeed
});

export const updateDailyFeed = (dailyFeed: any) => ({
  type: DailyFeedActions.UPDATE_DAILY_FEED,
  payload: dailyFeed
});

export const removeDailyFeed = (dailyFeedIds: any) => ({
  type: DailyFeedActions.REMOVE_DAILY_FEED,
  payload: dailyFeedIds
});