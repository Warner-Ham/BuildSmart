package com.example.buildsmart.repositories;

import com.example.buildsmart.model.Staff;
import com.example.buildsmart.model.StaffRole;
import com.example.buildsmart.model.StaffStatus;

import java.util.*;
import java.util.stream.Collectors;

/**
 * In-memory implementation of Staff repository
 * This will be replaced with database implementation in production
 */
public class StaffRepository implements BaseRepository<Staff, String> {
    private final Map<String, Staff> staffDatabase;

    public StaffRepository(){
        this.staffDatabase = new HashMap<>();
    }

    @Override
    public Staff save(Staff staff) throws IllegalAccessException {
        if (staff == null){
            throw new IllegalAccessException("Staff cannot be null");
        }
        staffDatabase.put(staff.getStaffId(), staff);
        System.out.println("Staff saved: " + staff.getStaffId());
        return staff;
    }

    @Override
    public Optional<Staff> findById(String id) {
        if(id == null || id.trim().isEmpty()){
            return Optional.empty();
        }
        return Optional.ofNullable(staffDatabase.get(id));
    }

    @Override
    public List<Staff> findAll() {
        return new ArrayList<>(staffDatabase.values());
    }

    @Override
    public boolean delete(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }
        Staff removed = staffDatabase.remove(id);
        if (removed != null){
            System.out.println("Staff deleted: " + id);
            return true;
        }
        return false;
    }

    @Override
    public boolean exists(String id) {
        return id != null && staffDatabase.containsKey(id);
    }

    @Override
    public long count() {
        return staffDatabase.size();
    }

    //Query methods specific to Staff
    public List<Staff> findByRole(StaffRole role) {
        if (role == null){
            return new ArrayList<>();
        }
        return staffDatabase.values().stream()
                .filter(staff -> staff.getRole() == role)
                .collect(Collectors.toList());
    }

    public List<Staff> findByStatus(StaffStatus status){
        if (status == null) {
            return new ArrayList<>();
        }
        return staffDatabase.values().stream()
                .filter(staff -> staff.getStatus() == status)
                .collect(Collectors.toList());
    }

    public Optional<Staff> findByEmail(String email){
        if(email == null || email.trim().isEmpty()){
            return Optional.empty();
        }
        return staffDatabase.values().stream()
                .filter(staff -> staff.getEmail().equalsIgnoreCase(email.trim()))
                .findFirst();
    }

    public List<Staff> findByName(String firstName, String lastName){
        return staffDatabase.values().stream()
                .filter(staff -> {
                    boolean firstNameMatch = firstName == null ||
                        staff.getFullName().toLowerCase().contains(firstName.toLowerCase());
                    boolean lastNameMatch = lastName == null ||
                        staff.getLastName().toLowerCase().contains(lastName.toLowerCase());
                    return firstNameMatch && lastNameMatch;
                })
                .collect(Collectors.toList());
    }


    //Utility method to clear all data
    public void clear(){
        staffDatabase.clear();
        System.out.println("All staff data cleared");
    }
}
