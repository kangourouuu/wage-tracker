"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkEntryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_work_entry_dto_1 = require("./create-work-entry.dto");
class UpdateWorkEntryDto extends (0, mapped_types_1.PartialType)(create_work_entry_dto_1.CreateWorkEntryDto) {
}
exports.UpdateWorkEntryDto = UpdateWorkEntryDto;
//# sourceMappingURL=update-work-entry.dto.js.map