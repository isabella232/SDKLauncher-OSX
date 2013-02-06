
/// <reference path="jquery.d.ts" />
///<reference path='size.ts' />
///<reference path='pagination_info.ts' />

module ReadiumSdk {
    class Reader {

        public viewPortSize : Size;
        public paginationInfo : PaginationInfo;

        constructor()
        {
            viewPortSize = new Size();
            paginationInfo = new PaginationInfo(1, 20);
        }

        public getEpubContentDocument()
        {
            return $("#epubContentIframe")[0].contentDocument;
        }

        private openPage(pageIndex : number)
        {
            if(pageIndex >= 0 && pageIndex < this.pagination.pageCount) {
                this.pagination.currentPage = pageIndex;
                this.displayCurrentPage();
            }
        }


        private moveNextPage() : void
        {
            console.log("OnNextPage()");

            if(this.pagination.currentPage < this.pagination.pageCount - 1) {
                this.pagination.currentPage++;
                this.displayCurrentPage();
            }
        }

        private movePrevPage() : void
        {
            console.log("OnPrevPage()");

            if(this.pagination.currentPage > 0) {
                this.pagination.currentPage--;
                this.displayCurrentPage();
            }

        }

        private displayCurrentPage() : void
        {
            if(this.pagination.currentPage < 0 || this.pagination.currentPage >= this.pagination.pageCount) {

                document.LauncherUI.onOpenPageIndexOfPages(0, 0);
                return;
            }

            var shift = this.pagination.currentPage * (_this.lastKeyholeSize.width + this.pagination.columnGap);

            var $epubHtml = $("html", this.getEpubContentDocument());
            $epubHtml.css("left", -shift + "px");

            document.LauncherUI.onOpenPageIndexOfPages(this.pagination.currentPage, this.pagination.pageCount);
        }

        private updateKeyholeSize() : bool
        {
            var newWidth = $("#key-hole").width();
            var newHeight = $("#key-hole").height();

            if(this.lastKeyholeSize.width !== newWidth || this.lastKeyholeSize.height !== newHeight){

                this.lastKeyholeSize.width = newWidth;
                this.lastKeyholeSize.height = newHeight;
                return true;
            }

            return false;
        };


        updatePagination() : void
        {
            this.pagination.columnWidth = (this.lastKeyholeSize.width - this.pagination.columnGap * (this.pagination.visibleColumnCount  -1)) / this.pagination.visibleColumnCount;

            var contentDoc = _this.getEpubContentDocument();
            $("html", contentDoc).css("width", _this.lastKeyholeSize.width);
            $("html", contentDoc).css("-webkit-column-width", _this.pagination.columnWidth + "px");

            thisß.displayCurrentPage();

            //TODO it takes time for layout engine to arrange columns we waite
            //it would be better to react on layout column reflow finished event
            setTimeout(function(){
                console.log("Set num of viewports");
                var columnizedContentWidth = $("html", contentDoc)[0].scrollWidth;
                $("#epubContentIframe").css("width", columnizedContentWidth);
                this.pagination.pageCount = Math.round(columnizedContentWidth / _this.lastKeyholeSize.width);

                if(this.pagination.currentPage >= this.pagination.pageCount) {
                    this.pagination.currentPage = this.pagination.pageCount - 1;
                }

                this.displayCurrentPage();
            }, 100);

        }
    }


    $(() => {

        var reader = new Reader();

         // When the iframe has been loaded, paginate the epub content document
        $("#epubContentIframe").on("load", (e) => {

            var $epubHtml = $("html", reader.getEpubContentDocument());

            $epubHtml.css("height", "100%");
            $epubHtml.css("position", "absolute");
            $epubHtml.css("-webkit-column-axis", "horizontal");
            $epubHtml.css("-webkit-column-gap", reader.paginationInfo.columnGap + "px");

/////////
//Columns Debugging
//                    $epubHtml.css("-webkit-column-rule-color", "red");
//                    $epubHtml.css("-webkit-column-rule-style", "dashed");
//                    $epubHtml.css("background-color", '#b0c4de');
/////////

            reader.pagination.currentPage = 0;
            reader.updateKeyholeSize();
            reader.updatePagination();

        });

        $(window).resize((e) => {

           if(reader.updateKeyholeSize()) {

               reader.updatePagination();
           }
        });
    });

}
