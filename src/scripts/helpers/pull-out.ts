export class PullOut {
    public contentContainer: HTMLDivElement;
    private background: HTMLDivElement;
    private closeResolve;
    private openResolve;

    constructor(private pullOutOptions: IPullOutOptions) {
        const self = this;

        this.background = document.createElement('div');
        this.background.classList.add('pull-out-background');

        this.contentContainer = document.createElement('div');
        this.contentContainer.classList.add('pull-out');
        this.contentContainer.classList.add(pullOutOptions.colWidth ? pullOutOptions.colWidth : 'is-4');
        this.contentContainer.classList.add('column');
        this.contentContainer.classList.add('is-hidden');
        this.pullOutOptions.attachTo.appendChild(this.contentContainer);

        this.contentContainer.appendChild(this.pullOutOptions.content);
        this.contentContainer.addEventListener('transitionend', (e) => {
            self.slideComplete(e);
        }, false);
    }

    public show(): Promise<void>  {
        const self = this;
        this.pullOutOptions.attachTo.appendChild(this.background);
        this.contentContainer.classList.remove('is-hidden');
        this.contentContainer.style.right = '-10000px';

        const clientWidth = this.contentContainer.clientWidth;
        this.contentContainer.style.right = `${clientWidth * -1}px`;
        document.body.classList.add('modal-open');
        this.contentContainer.classList.add('animate');
        this.contentContainer.style.right = '0';
        return new Promise<void>((resolve, reject) => {
            self.openResolve = resolve;
        });

    }

    public close() {
        const self = this;
        const clientWidth = this.contentContainer.clientWidth;
        this.contentContainer.style.right = `${clientWidth * -1}px`;
        return new Promise<void>((resolve, reject) => {
            self.closeResolve = resolve;
        });
    }

    private escapeHandler(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
        }
    }
    private backgroundClickHandler(event: MouseEvent) {
        this.close();
    }

    private slideComplete(event: Event) {
        const self = this;
        if (this.contentContainer.style.right !== '0px') {
            this.contentContainer.classList.remove('animate');
            this.contentContainer.classList.add('is-hidden');
            this.pullOutOptions.attachTo.removeChild(this.background);
            document.body.classList.remove('modal-open');
            document.removeEventListener('keyup', (ev: KeyboardEvent) => { self.escapeHandler(ev); } );
            this.background.removeEventListener('click', (ev: MouseEvent) => { self.backgroundClickHandler(ev); });
            this.closeResolve();
        } else {
            document.addEventListener('keyup', (ev: KeyboardEvent) => { self.escapeHandler(ev); } );
            this.background.addEventListener('click', (ev: MouseEvent) => { self.backgroundClickHandler(ev); });
            this.openResolve();
        }
    }
}

export interface IPullOutOptions {
    content: HTMLElement;
    attachTo: HTMLElement;
    colWidth?: string;
}
