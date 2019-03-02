export interface IComponent {
    attachedTo: HTMLElement;
    init(params?: any|null): Promise<void>;
}
