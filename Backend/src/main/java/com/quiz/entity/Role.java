package com.quiz.entity;

import com.quiz.app.role.dto.PostCreateRoleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "VAITRO")
public class Role {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "MAVAITRO")
	private Integer id;

	@Column(name = "TENVAITRO", length = 40, nullable = false, unique = true)
	private String name;

	public Role(int id) {
		this.id = id;
	}
	public Role(String name) {
		this.name = name;
	}


	public static Role build(PostCreateRoleDTO postCreateRoleDTO) {
		return Role.builder().name(postCreateRoleDTO.getName()).build();
	}
}
