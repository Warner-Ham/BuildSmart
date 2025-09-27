/**
 * Staff Repository matching Java backend StaffRepository.java
 */
class StaffRepository {
    constructor() {
        this.staffDatabase = new Map();
    }

    save(staff) {
        if (staff == null) {
            throw new Error('Staff cannot be null');
        }
        this.staffDatabase.set(staff.getStaffId(), staff);
        console.log('Staff saved: ' + staff.getStaffId());
        return staff;
    }

    findById(id) {
        if (id == null || id.trim() === '') {
            return null;
        }
        return this.staffDatabase.get(id) || null;
    }

    findAll() {
        return Array.from(this.staffDatabase.values());
    }

    delete(id) {
        if (id == null || id.trim() === '') {
            return false;
        }
        const removed = this.staffDatabase.delete(id);
        if (removed) {
            console.log('Staff deleted: ' + id);
        }
        return removed;
    }

    exists(id) {
        return id != null && this.staffDatabase.has(id);
    }

    count() {
        return this.staffDatabase.size;
    }

    findByRole(role) {
        if (role == null) {
            return [];
        }
        return this.findAll().filter(staff => staff.getRole() === role);
    }

    findByStatus(status) {
        if (status == null) {
            return [];
        }
        return this.findAll().filter(staff => staff.getStatus() === status);
    }

    findByEmail(email) {
        if (email == null || email.trim() === '') {
            return null;
        }
        return this.findAll().find(staff =>
            staff.getEmail().toLowerCase() === email.trim().toLowerCase()
        ) || null;
    }

    findByName(firstName, lastName) {
        return this.findAll().filter(staff => {
            const firstNameMatch = firstName == null ||
                staff.getFirstName().toLowerCase().includes(firstName.toLowerCase());
            const lastNameMatch = lastName == null ||
                staff.getLastName().toLowerCase().includes(lastName.toLowerCase());
            return firstNameMatch && lastNameMatch;
        });
    }

    clear() {
        this.staffDatabase.clear();
        console.log('All staff data cleared');
    }
}

export default StaffRepository;