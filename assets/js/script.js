const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const app = {
    currentIndex: 0,
    isPlaying: false,
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
    ],
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
            <div class="song">
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
        $(".playlist").innerHTML = htmls.join("");
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
        };
        // Khi xong bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
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
        progress.onchange = function (e) {
            const seekTime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        };
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start: function () {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe và xử lý các sự kiện (DOM Events)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();
    },
};

app.start();
