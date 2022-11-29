package com.quiz.app.role;

import com.quiz.app.utils.CommonUtils;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.role.dto.PostCreateRoleDTO;
import com.quiz.app.role.dto.RolesDTO;
import com.quiz.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin/roles")
public class RoleRestController {
    @Autowired
    RoleService roleService;

    @Autowired
    private CommonUtils commonUtils;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<RolesDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
    ) {
        RolesDTO rolesDTO = new RolesDTO();

        if (page.equals("0")) {
            List<Role> roles = roleService.findAll();

            rolesDTO.setRoles(roles);
            rolesDTO.setTotalElements(roles.size());
            rolesDTO.setTotalPages(0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);

            Page<Role> rolesPage = roleService.findAllRoles(filters);

            rolesDTO.setRoles(rolesPage.getContent());
            rolesDTO.setTotalElements(rolesPage.getTotalElements());
            rolesDTO.setTotalPages(rolesPage.getTotalPages());
        }

        return new OkResponse<>(rolesDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Role>> saveSubject(
            @RequestBody PostCreateRoleDTO postCreateRoleDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        Role savedSubject = null;

        Integer id = postCreateRoleDTO.getId();
        String name = postCreateRoleDTO.getName();

        if (Objects.isNull(name)) {
            commonUtils.addError("name", "Tên vai trò không được để trống");
        }

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<Role>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (roleService.isNameDuplicated(id, name, isEdit)) {
                commonUtils.addError("name", "Tên vai trò đã tồn tại");
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<Role>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                Role role = roleService.findById(id);
                role.setName(name);

                savedSubject = roleService.save(role);
            } catch (NotFoundException exception) {
                return new BadResponse<Role>(exception.getMessage()).response();
            }
        } else {
            savedSubject = roleService.save(Role.build(postCreateRoleDTO));
        }

        return new OkResponse<>(savedSubject).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(roleService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
