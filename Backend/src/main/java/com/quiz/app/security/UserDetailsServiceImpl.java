package com.quiz.app.security;

import com.quiz.app.user.UserRepository;
import com.quiz.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		Optional<User> user = userRepository.findById(id);

		if (user.isPresent()) {
			return UserDetailsImpl.build(user.get());
		}

		throw new UsernameNotFoundException("Không tìm thấy người dùng với mã " + id);
	}
}