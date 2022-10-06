package com.quiz.app.utils;


import com.quiz.app.FileUploadUtil;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Objects;
import java.util.Set;

public class ProcessImage {
    public static String getResourceAsFile(String relativeFilePath) throws FileNotFoundException {
        return ResourceUtils.getURL("classpath:" + relativeFilePath).getFile();
    }

    public static void uploadImage(String devUploadDir, String prodUploadDir, String staticPath, MultipartFile image, String environment)
            throws IOException {
        if (image == null) {
            return;
        }

        String fileName = StringUtils.cleanPath(Objects.requireNonNull(image.getOriginalFilename()));
        String uploadDir = "";
        if (environment.equals("development")) {
            uploadDir = devUploadDir;
        } else {
            Path uploadPath = Paths.get(prodUploadDir);
            if (!Files.exists(uploadPath)) {
                Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                        .asFileAttribute(permissions);

                Files.createDirectories(uploadPath, fileAttributes);
            }
            uploadDir = getResourceAsFile(staticPath);
        }

        FileUploadUtil.cleanDir(uploadDir);
        FileUploadUtil.saveFile(uploadDir, fileName, image);
    }
}
