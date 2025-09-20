package com.example.buildsmart.repositories;

import java.util.List;
import java.util.Optional;

/*
 * Generic repository interface defining basic CRUD operations
 * @param <T> Entity type
 * @param <ID> Primary key type
 */
public interface BaseRepository <T, ID> {
    /**
     * Save or update an entity
     * @param entity Entity to save
     * @return Saved entity
     */
    T save(T entity);

    /**
     * Find entity by ID
     * @param id Entity ID
     * @return Optional containing entity if found
     */
    Optional<T> findById(ID id);

    /**
     * Find all entities
     * @return List of all entities
     */
    List<T> findAll();

    /**
     * Delete entity by ID
     * @param id Entity ID
     * @return true if deleted, false if not found
     */
    boolean delete(ID id);

    /**
     * Check if entity exists by ID
     * @param id Entity ID
     * @return true if exists, false otherwise
     */
    boolean exists(ID id);

    /**
     * Count total number of entities
     * @return Total count
     */
    long count();
}
