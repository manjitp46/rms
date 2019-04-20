import {MembersController} from './members';
import {ExpenseController} from './expenses'

export const CONTROLLERS = [
    new MembersController(),
    new ExpenseController()
]