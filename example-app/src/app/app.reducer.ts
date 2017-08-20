import { ActionReducer } from '@ngrx/store';
import { FormGroupState, createFormGroupReducer, createFormGroupState, SetErrorsAction } from '@ngrx/forms';

import { AppState, initialState, ITEM_FORM_ID } from './app.state';
import { Actions, AddTodoItemAction } from './app.actions';
import { ItemFormValue, textValidator, priorityValidator, duedateValidator, initialItemFormValue } from './item-form/item-form.state';

const formReducer = createFormGroupReducer(ITEM_FORM_ID, initialItemFormValue);

function validateItemForm(state: FormGroupState<ItemFormValue>) {
  const meta = () => state.controls.meta as FormGroupState<any>;
  state = formReducer(state, new SetErrorsAction(state.controls.text.id, textValidator(state.value.text)));
  state = formReducer(state, new SetErrorsAction(meta().controls.priority.id, priorityValidator(state.value.meta.priority)));
  state = formReducer(state, new SetErrorsAction(meta().controls.duedate.id, duedateValidator(state.value.meta.duedate)));
  return state;
}

const initialItemFormState = validateItemForm(initialState.itemForm);

export function appReducer(state = { ...initialState, itemForm: initialItemFormState }, action: Actions): AppState {
  const itemForm = formReducer(state.itemForm, action);
  if (itemForm !== state.itemForm) {
    state = { ...state, itemForm: validateItemForm(itemForm) };
  }

  switch (action.type) {
    case AddTodoItemAction.TYPE:
      return {
        ...state,
        items: [...state.items, action.item],
        itemForm: initialItemFormState,
      };

    default: {
      return state;
    }
  }
}

export const reducers = {
  app: appReducer,
};
