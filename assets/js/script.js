const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const player = $(".player");
const progress = $("#progress");
const playlist = $(".playlist");
// Local Storage
const PLAYER_STORAGE_KEY = "MICHAEL_THINH_1008";
// Button
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
// App
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Save Your Tears",
            singer: "The Weeknd",
            path: "./assets/music/save-your-tears.mp3",
            image: "./assets/img/save-your-tears-banner.jpg",
        },
        {
            name: "Bloody Mary (Fast Version) ft. Wednesday",
            singer: "Lady Gaga",
            path: "./assets/music/bloody-mary.mp3",
            image: "./assets/img/bloody-mary-banner.jpg",
        },
        {
            name: "Heat Waves",
            singer: "Glass Animals",
            path: "./assets/music/heat-waves.mp3",
            image: "./assets/img/heat-waves-banner.jpg",
        },
        {
            name: "Die For You",
            singer: "The Weeknd",
            path: "./assets/music/die-for-you.mp3",
            image: "./assets/img/die-for-you-banner.jpg",
        },
        {
            name: "Thrift Shop",
            singer: "Macklemore & Ryan Lewis",
            path: "./assets/music/thrift-shop.mp3",
            image: "./assets/img/thrift-shop-banner.jpg",
        },
        {
            name: "Light Switch",
            singer: "Charlie Puth",
            path: "./assets/music/light-switch.mp3",
            image: "./assets/img/light-switch-banner.jpg",
        },
        {
            name: "Dancin (Krono Remix)",
            singer: "Aaron Smith Ft. Luvli",
            path: "./assets/music/dancin-krono-remix.mp3",
            image: "./assets/img/dancin-krono-remix-banner.jpg",
        },
        {
            name: "Stressed Out",
            singer: "twenty one pilots",
            path: "./assets/music/stressed-out.mp3",
            image: "./assets/img/stressed-out-banner.jpg",
        },
        {
            name: "Gangsta's Paradise",
            singer: "Coolio Ft. L.V",
            path: "./assets/music/gangsta-paradise.mp3",
            image: "./assets/img/gangsta-paradise-banner.jpg",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${
                index === this.currentIndex ? "active" : ""
            }" data-index="${index}" >
                <div
                    class="thumb"
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties() {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();
        // Xử lý phóng to, thu nhỏ CD
        document.onscroll = function () {
            const scrollTop =
                document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        // Khi xong bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };
        // Khi tua bài hát
        progress.oninput = function (e) {
            const seekTime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        };
        // Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // Khi prev bài hát
        prevBtn.onclick = function () {
            _this.prevSong();
            _this.render();
            _this.scrollToActiveSong();
            audio.play();
        };
        // Khi random bài hát
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };
        // Xử lý next song khi audio kết thúc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        // Xử lý phát lại một bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };
        // Lắng nghe hahf vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // Xử lý khi click vào song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 250);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình config vào ứng dụng
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe và xử lý các sự kiện (DOM Events)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();
        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },
};

app.start();
