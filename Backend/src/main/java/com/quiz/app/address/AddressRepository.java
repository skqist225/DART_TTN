package com.quiz.app.address;

import com.quiz.entity.Address;

import org.springframework.data.repository.CrudRepository;

public interface AddressRepository extends CrudRepository<Address, Integer> {
    Address findById(int id);
}
