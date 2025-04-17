export const CART_UPDATED_EVENT = 'cartUpdated';

export const triggerCartUpdate = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};
