function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
        return range(1, totalPages);
    }

    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }

    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages-sideWidth + 1, totalPages));
}

const hotMovieList = document.querySelectorAll(".hot-movie .movie-iteme");
const latestMovieList = document.querySelectorAll(".latest-movie .movie-iteme");
const watchList = document.querySelectorAll(".favorite-movie .movie-iteme");

function setHoverEffect(movieList) {
    let max = 0;
    movieList.forEach( e => {
        if (max < e.offsetLeft) max = e.offsetLeft;
    });
    movieList.forEach( e => {
        if (e.offsetLeft == max && max > 150) e.querySelector(".Hover").classList.add("Hover-left");
        else e.querySelector(".Hover").classList.remove("Hover-left");
    });
}

$(function() {
    setHoverEffect(hotMovieList);
    setHoverEffect(latestMovieList);
    setHoverEffect(watchList);
    window.addEventListener("resize", () => {
        setHoverEffect(hotMovieList);
        setHoverEffect(latestMovieList);
        setHoverEffect(watchList);
    });
})

$(function() {
    var numberOfItems = $(".hot-movie .movie-iteme").length;
    var limitPerPage = 6; // How many card items visible per page
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5; // How many page elements visible in the paginaiton
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".hot-movie .movie-iteme").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".hot-movies-pagi li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots").toggleClass("active", item === currentPage).append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".hot-movies-pagi .next-page")
        });

        $(".hot-movies-pagi .previous-page").toggleClass("disable", currentPage === 1);
        $(".hot-movies-pagi .next-page").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $(".hot-movies-pagi").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
    );

    $(".hot-movie").show();
    showPage(1);

    $(document).on("click", ".hot-movies-pagi li.current-page:not(.active)", function() {
        return showPage(+$(this).text());
    });

    $(".hot-movies-pagi .next-page").on("click", function() {
        return showPage(currentPage + 1);
    });

    $(".hot-movies-pagi .next-page").on("click", function() {
        return setHoverEffect(hotMovieList);
    });

    $(".hot-movies-pagi .previous-page").on("click", function() {
        return showPage(currentPage - 1);
    });

    $(".hot-movies-pagi .previous-page").on("click", function() {
        return setHoverEffect(hotMovieList);
    });
});

$(function() {
    var numberOfItems = $(".latest-movie .movie-iteme").length;
    var limitPerPage = 6; // How many card items visible per page
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5; // How many page elements visible in the paginaiton
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".latest-movie .movie-iteme").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".latest-update-pagi li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots").toggleClass("active", item === currentPage).append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".latest-update-pagi .next-page")
        });

        $(".latest-update-pagi .previous-page").toggleClass("disable", currentPage === 1);
        $(".latest-update-pagi .next-page").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $(".latest-update-pagi").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
    );

    $(".latest-movie").show();
    showPage(1);

    $(document).on("click", ".latest-update-pagi li.current-page:not(.active)", function() {
        return showPage(+$(this).text());
    });

    $(".latest-update-pagi .next-page").on("click", function() {
        return showPage(currentPage + 1);
    });

    $(".latest-update-pagi .next-page").on("click", function() {
        return setHoverEffect(latestMovieList);
    });

    $(".latest-update-pagi .previous-page").on("click", function() {
        return showPage(currentPage - 1);
    });

    $(".latest-update-pagi .previous-page").on("click", function() {
        return setHoverEffect(latestMovieList);
    });
});

$(function() {
    var numberOfItems = $(".favorite-movie .movie-iteme").length;
    var limitPerPage = 6; // How many card items visible per page
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5; // How many page elements visible in the paginaiton
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".favorite-movie .movie-iteme").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".watch-list-pagi li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots").toggleClass("active", item === currentPage).append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".watch-list-pagi .next-page")
        });

        $(".watch-list-pagi .previous-page").toggleClass("disable", currentPage === 1);
        $(".watch-list-pagi .next-page").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $(".watch-list-pagi").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
    );

    $(".favorite-movie").show();
    showPage(1);

    $(document).on("click", ".watch-list-pagi li.current-page:not(.active)", function() {
        return showPage(+$(this).text());
    });

    $(".watch-list-pagi .next-page").on("click", function() {
        return showPage(currentPage + 1);
    });

    $(".watch-list-pagi .next-page").on("click", function() {
        return setHoverEffect(watchList);
    });

    $(".watch-list-pagi .previous-page").on("click", function() {
        return showPage(currentPage - 1);
    });

    $(".watch-list-pagi .previous-page").on("click", function() {
        return setHoverEffect(watchList);
    });
});