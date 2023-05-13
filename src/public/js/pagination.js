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

const movieList = document.querySelectorAll(".movie-list .movie-iteme");
const resultList = document.querySelectorAll(".result-list .movie-iteme");

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
    setHoverEffect(movieList);
    setHoverEffect(resultList);
    window.addEventListener("resize", () => {
        setHoverEffect(movieList);
        setHoverEffect(resultList);
    });
})

$(function() {
    var numberOfItems = $(".movie-list .movie-iteme").length;
    var limitPerPage = 6; // How many card items visible per page
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5; // How many page elements visible in the paginaiton
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".movie-list .movie-iteme").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".pagi li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots").toggleClass("pagi-active", item === currentPage).append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".pagi .next-page")
        });

        $(".pagi .previous-page").toggleClass("pagi-disable", currentPage === 1);
        $(".pagi .next-page").toggleClass("pagi-disable", currentPage === totalPages);
        return true;
    }

    $(".pagi").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
    );

    $(".movie-list").show();
    showPage(1);

    $(document).on("click", ".pagi li.current-page:not(.pagi-active)", function() {
        return showPage(+$(this).text());
    });

    $(".pagi .next-page").on("click", function() {
        return showPage(currentPage + 1);
    });

    $(".pagi .next-page").on("click", function() {
        return setHoverEffect(movieList);
    });

    $(".pagi .previous-page").on("click", function() {
        return showPage(currentPage - 1);
    });

    $(".pagi .previous-page").on("click", function() {
        return setHoverEffect(movieList);
    });
});

$(function() {
    var numberOfItems = $(".result-list .movie-iteme").length;
    var limitPerPage = 6; // How many card items visible per page
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5; // How many page elements visible in the paginaiton
    var currentPage;
    

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".result-list .movie-iteme").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".result-pagi li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots").toggleClass("pagi-active", item === currentPage).append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".result-pagi .next-page")
        });

        $(".result-pagi .previous-page").toggleClass("pagi-disable", currentPage === 1);
        $(".result-pagi .next-page").toggleClass("pagi-disable", currentPage === totalPages);
        return true;
    }

    $(".result-pagi").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
    );

    $(".result-list").show();
    showPage(1);

    $(document).on("click", ".result-pagi li.current-page:not(.pagi-active)", function() {
        return showPage(+$(this).text());
    });

    $(".result-pagi .next-page").on("click", function() {
        return showPage(currentPage + 1);
    });

    $(".result-pagi .next-page").on("click", function() {
        return setHoverEffect(resultList);
    });

    $(".result-pagi .previous-page").on("click", function() {
        return showPage(currentPage - 1);
    });

    $(".result-pagi .previous-page").on("click", function() {
        return setHoverEffect(resultList);
    });
});