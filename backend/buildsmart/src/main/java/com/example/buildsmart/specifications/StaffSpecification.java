package com.example.buildsmart.specifications;

import com.example.buildsmart.entity.Staff;
import com.example.buildsmart.enums.StaffRole;
import com.example.buildsmart.enums.StaffStatus;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class StaffSpecification {

    public static Specification<Staff> withFilters(
            String searchTerm, String firstName, String lastName,
            String email, String phoneNumber, StaffRole role, StaffStatus status) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // General search term (searches across multiple fields)
            if (searchTerm != null && !searchTerm.isEmpty()) {
                String searchPattern = "%" + searchTerm.toLowerCase() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("phoneNumber")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("staffId")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), searchPattern)
                );
                predicates.add(searchPredicate);
            }

            // Specific field filters
            if (firstName != null && !firstName.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("firstName")),
                        "%" + firstName.toLowerCase() + "%"
                ));
            }

            if (lastName != null && !lastName.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("lastName")),
                        "%" + lastName.toLowerCase() + "%"
                ));
            }

            if (email != null && !email.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")),
                        "%" + email.toLowerCase() + "%"
                ));
            }

            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        root.get("phoneNumber"),
                        "%" + phoneNumber + "%"
                ));
            }

            if (role != null) {
                predicates.add(criteriaBuilder.equal(root.get("role"), role));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
