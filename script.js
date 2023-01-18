class Album {
    constructor(containerId, fetchingURL, photosCount) {
        this.picturesContainer = document.getElementById('pictures');
        this.banner = document.getElementById('banner');
        this.pictureZoomed = document.getElementById('pictureZoomed');
        this.exitButton = document.getElementById('exitButton');
        this.previousButton = document.getElementById('previousButton');
        this.nextButton = document.getElementById('nextButton');
        this.buttonsDiv = document.getElementById('buttons');
        this.pictureCounter = document.getElementById('pictureCounter');
        this.screenLocker = document.getElementById('screenLocker');
        this.containerId = containerId;
        this.fetchingURL = fetchingURL;
        this.photosCount = photosCount;
        this.fetchedArray = [];
        this.numOfChosenPicture = null;
    }

    addScreenLock() {
        this.screenLocker.style.visibility = 'visible';
    }

    hideScreenLock() {
        this.screenLocker.style.visibility = '';
    }

    bannerUnvisible() {
        Array.from(this.banner.children).forEach((element) => {
            element.style.visibility = 'hidden';
        });
    }

    bannerVisible() {
        Array.from(this.banner.children).forEach((element) => {
            element.style.visibility = 'visible';
        });
    }

    handleCounter() {
        this.pictureCounter.innerHTML = `picture ${this.numOfChosenPicture + 1}/${this.photosCount}`;
    }

    lockerClickEvent() {
        this.screenLocker.addEventListener('click', () => {
            this.pictureZoomed.innerHTML = '';
            this.bannerUnvisible();
            this.hideScreenLock();
            this.banner.style.zIndex = '';
        });
    }

    setCloseBannerEvent() {
        this.exitButton.addEventListener('click', () => {
            this.pictureZoomed.innerHTML = '';
            this.bannerUnvisible();
            this.hideScreenLock();
            this.banner.style.zIndex = '';
        });
    }

    setPreviousPictureEvent() {
        this.previousButton.addEventListener('click', () => {
            if (this.numOfChosenPicture === 0) return;
            this.numOfChosenPicture -= 1;
            const previousElement = this.fetchedArray[this.numOfChosenPicture];
            this.handleCounter();
            this.pictureZoomed.innerHTML = `
                <img src="${
    previousElement.url
}" alt="${
    previousElement.id
}" tittle="${
    previousElement.title
}" class="album-banner">`;
        });
    }

    setNextPictureEvent() {
        this.nextButton.addEventListener('click', () => {
            if (this.numOfChosenPicture === this.photosCount - 1) return;
            this.numOfChosenPicture += 1;
            const nextElement = this.fetchedArray[this.numOfChosenPicture];
            this.handleCounter();
            this.pictureZoomed.innerHTML = `
                <img src="${
    nextElement.url
}" alt="${
    nextElement.id
}" tittle="${
    nextElement.title
}" class="album-banner">`;
        });
    }

    eventPictureOnClick(element, index) {
        element.addEventListener(
            'click',
            () => {
                this.numOfChosenPicture = index;
                const currentElement = this.fetchedArray[index];
                this.handleCounter();
                this.addScreenLock();
                this.pictureZoomed.innerHTML = `
                <img src="${
    currentElement.url
}" alt="${
    currentElement.id
}" tittle="${
    currentElement.title
}" class="album-banner">`;
                this.bannerVisible();
                this.banner.style.zIndex = '5';
                this.addScreenLock();
            },
            true,
        );
    }

    addEventListener() {
        const elements = Array.from(this.picturesContainer.children);

        elements.forEach((element, index) => {
            this.eventPictureOnClick(element, index);
        });
    }

    async fetchData() {
        const response = await fetch(this.fetchingURL);
        const data = await response.json();

        data.forEach((element) => {
            if (element.id <= this.photosCount) {
                this.fetchedArray.push(element);
            }
        });
    }

    createContent(element, className, content) {
        return `<img src="${content}" alt="${element.title}" tittle="${element.title}"
        class="${className}">`;
    }

    appendElement(containerId, nodeType, elementIdName, content) {
        if (!document.getElementById(elementIdName)) {
            const element = document.createElement(nodeType);

            element.innerHTML = content;
            element.setAttribute('id', elementIdName);
            document.getElementById(containerId).append(element);
        }
    }

    async insertPictures() {
        await this.fetchData();
        this.fetchedArray.forEach((element, index) => {
            this.appendElement(
                this.picturesContainer.id,
                'div',
                `div${index}`,
                this.createContent(element, 'thumbnailUrl', element.thumbnailUrl),
            );
        });
    }

    async makeAlbum() {
        this.bannerUnvisible();
        await this.insertPictures();
        this.addEventListener();
        this.setNextPictureEvent();
        this.setPreviousPictureEvent();
        this.setCloseBannerEvent();
        this.lockerClickEvent();
    }
}

const album = new Album('section', 'https://jsonplaceholder.typicode.com/photos', 150);

album.makeAlbum();
