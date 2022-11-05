package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "CATHI")
public class Exam {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "MACATHI")
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "MALTC")
	private CreditClass creditClass;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@Column(name = "NGAYTHI", nullable = false)
	private LocalDateTime examDate;

	@Column(name = "THOIGIANLAMBAI", columnDefinition = "SMALLINT", nullable = false)
	private int timeInterval;

	@Column(name = "LAYDIEMCHO")
	private String countInPoints;

	@Builder.Default
	@ManyToMany
	@JoinTable(name = "CATHI_BODE", joinColumns = @JoinColumn(name = "MACATHI"),
			inverseJoinColumns = @JoinColumn(name = "MABODE"))
	private Set<Test> tests = new HashSet<>();

	@ManyToOne
	private User teacher;
}
