"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageCounter = void 0;
var PageCounter = /** @class */ (function () {
    function PageCounter(doc) {
        this.doc = doc;
        this.pages = new Map();
    }
    // Sayfa numarası koymak istediğiniz yere çağırın
    PageCounter.prototype.addPageNumber = function (x, y) {
        var currentPage = this.doc.bufferedPageRange().count;
        this.pages.set(currentPage - 1, { x: x, y: y });
        // Sayfa sayısı belge tamamlandığında bilinecek
        return this;
    };
    // Belge bittikten sonra çağırın
    PageCounter.prototype.writePageNumbers = function (totalPages) {
        // Her sayfaya dön ve numarayı ekle
        for (var _i = 0, _a = this.pages.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], pageNumber = _b[0], _c = _b[1], x = _c.x, y = _c.y;
            this.doc.switchToPage(pageNumber);
            this.doc.text("".concat(pageNumber + 1, "/").concat(totalPages), x, y, {
                align: "right",
            });
        }
    };
    return PageCounter;
}());
exports.PageCounter = PageCounter;
