import {JoinTableOptions} from "typeorm";

export const userApprovedUsersTableOptionsTableOptions: JoinTableOptions = {
    name: 'user_approved_users',
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'approvedUserId',
        referencedColumnName: 'id',
    },
}

export const userRejectedUsersTableOptionsTableOptions: JoinTableOptions = {
    name: 'user_rejected_users',
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'rejectedUserId',
        referencedColumnName: 'id',
    },
}

export const userMatchedUsersTableOptions: JoinTableOptions = {
    name: 'user_matched_users',
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'matchedUserId',
        referencedColumnName: 'id',
    },
}

export const userKnownLanguagesTableOptions: JoinTableOptions = {
    name: 'user_known_languages',
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'languageId',
        referencedColumnName: 'id',
    },
}

export const userWantToKnowLanguagesTableOptions: JoinTableOptions = {
    name: 'user_want_to_know_languages',
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'languageId',
        referencedColumnName: 'id',
    },
}