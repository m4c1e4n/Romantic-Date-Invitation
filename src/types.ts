export type DatePageStep =
  | 'proposal'
  | 'celebration'
  | 'question-day'
  | 'question-food'
  | 'question-vibe'
  | 'letter'
  | 'paywall'
  | 'ticket';

export type FoodCategory = 'ghanaian' | 'continental';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  emoji: string;
  tag: string;
  ghanaianFlag?: boolean;
}

export interface DateDetails {
  date: string;
  timeSlot: string;
  customTime: string;
  selectedFoods: string[];
  customFoodNote?: string;
  vibe: string;
  sweetAddOns: string[];
  noteForHim: string;
}

