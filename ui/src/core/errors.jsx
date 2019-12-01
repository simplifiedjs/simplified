import {__} from './lang';

const errors = {
    systemError: __('Something went wrong. Unable to complete your request.'),
    userNotExist: __('No user found.'),
    invalidEmail: __('Invalid email address.'),
    invalidUserId: __('Invalid user ID.'),
    invalidGroupId: __('Invalid user group ID.'),
    incorrectLogin: __('Incorrect username and/or password.')
};

export default errors;