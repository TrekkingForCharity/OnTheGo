export interface INavigationRejection {
    navigationRejectionReason: NavigationRejectionReason;
    data?: any|null;
}

export enum NavigationRejectionReason {
    loginBack = 1,
    notAuthenticated = 2,
    notFound = 3,
    locked = 4,
    notSafe = 5,
}
