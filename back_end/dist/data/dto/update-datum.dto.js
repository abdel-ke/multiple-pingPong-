"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDatumDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_datum_dto_1 = require("./create-datum.dto");
class UpdateDatumDto extends (0, mapped_types_1.PartialType)(create_datum_dto_1.CreateDatumDto) {
}
exports.UpdateDatumDto = UpdateDatumDto;
//# sourceMappingURL=update-datum.dto.js.map