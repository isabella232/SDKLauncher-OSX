var ReadiumSdk;
(function (ReadiumSdk) {
    var Reader = (function () {
        function Reader() {
            viewPortSize = new Size();
            paginationInfo = new PaginationInfo(1, 20);
        }
        Reader.prototype.getEpubContentDocument = function () {
            return $("#epubContentIframe")[0].contentDocument;
        };
        Reader.prototype.openPage = function (pageIndex) {
            if(pageIndex >= 0 && pageIndex < this.pagination.pageCount) {
                this.pagination.currentPage = pageIndex;
                this.displayCurrentPage();
            }
        };
        Reader.prototype.moveNextPage = function () {
            console.log("OnNextPage()");
            if(this.pagination.currentPage < this.pagination.pageCount - 1) {
                this.pagination.currentPage++;
                this.displayCurrentPage();
            }
        };
        Reader.prototype.movePrevPage = function () {
            console.log("OnPrevPage()");
            if(this.pagination.currentPage > 0) {
                this.pagination.currentPage--;
                this.displayCurrentPage();
            }
        };
        Reader.prototype.displayCurrentPage = function () {
            if(this.pagination.currentPage < 0 || this.pagination.currentPage >= this.pagination.pageCount) {
                document.LauncherUI.onOpenPageIndexOfPages(0, 0);
                return;
            }
            var shift = this.pagination.currentPage * (_this.lastKeyholeSize.width + this.pagination.columnGap);
            var $epubHtml = $("html", this.getEpubContentDocument());
            $epubHtml.css("left", -shift + "px");
            document.LauncherUI.onOpenPageIndexOfPages(this.pagination.currentPage, this.pagination.pageCount);
        };
        Reader.prototype.updateKeyholeSize = function () {
            var newWidth = $("#key-hole").width();
            var newHeight = $("#key-hole").height();
            if(this.lastKeyholeSize.width !== newWidth || this.lastKeyholeSize.height !== newHeight) {
                this.lastKeyholeSize.width = newWidth;
                this.lastKeyholeSize.height = newHeight;
                return true;
            }
            return false;
        };
        Reader.prototype.updatePagination = function () {
            this.pagination.columnWidth = (this.lastKeyholeSize.width - this.pagination.columnGap * (this.pagination.visibleColumnCount - 1)) / this.pagination.visibleColumnCount;
            var contentDoc = _this.getEpubContentDocument();
            $("html", contentDoc).css("width", _this.lastKeyholeSize.width);
            $("html", contentDoc).css("-webkit-column-width", _this.pagination.columnWidth + "px");
            thisß.displayCurrentPage();
            setTimeout(function () {
                console.log("Set num of viewports");
                var columnizedContentWidth = $("html", contentDoc)[0].scrollWidth;
                $("#epubContentIframe").css("width", columnizedContentWidth);
                this.pagination.pageCount = Math.round(columnizedContentWidth / _this.lastKeyholeSize.width);
                if(this.pagination.currentPage >= this.pagination.pageCount) {
                    this.pagination.currentPage = this.pagination.pageCount - 1;
                }
                this.displayCurrentPage();
            }, 100);
        };
        return Reader;
    })();    
    $(function () {
        var reader = new Reader();
        $("#epubContentIframe").on("load", function (e) {
            var $epubHtml = $("html", reader.getEpubContentDocument());
            $epubHtml.css("height", "100%");
            $epubHtml.css("position", "absolute");
            $epubHtml.css("-webkit-column-axis", "horizontal");
            $epubHtml.css("-webkit-column-gap", reader.paginationInfo.columnGap + "px");
            reader.pagination.currentPage = 0;
            reader.updateKeyholeSize();
            reader.updatePagination();
        });
        $(window).resize(function (e) {
            if(reader.updateKeyholeSize()) {
                reader.updatePagination();
            }
        });
    });
})(ReadiumSdk || (ReadiumSdk = {}));
