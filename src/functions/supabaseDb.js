import { supabase } from "../config/supabaseClient";

/**
 * Classes Functions
 */

export const addClass = async (classData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    console.log("Adding class for user:", user.id);
    console.log("Class data:", classData);

    const { data, error } = await supabase
      .from("classes")
      .insert([
        {
          user_id: user.id,
          course_title: classData.courseTitle,
          course_description: classData.courseDescription,
          color: classData.color,
          days: classData.days,
          time: classData.time,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Class added successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Error adding class:", error);
    return { data: null, error };
  }
};

export const getClasses = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { data: [], error };
  }
};

export const deleteClass = async (classId) => {
  try {
    const { error } = await supabase.from("classes").delete().eq("id", classId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting class:", error);
    return { error };
  }
};

/**
 * Tasks Functions
 */

export const addTask = async (taskData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    console.log("Adding task for user:", user.id);
    console.log("Task data:", taskData);

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: user.id,
          task_title: taskData.task_title || taskData.taskTitle,
          task_description:
            taskData.task_description || taskData.taskDescription,
          class: taskData.class_id || taskData.class,
          deadline: taskData.deadline,
          workload: taskData.workload,
          notes: taskData.notes,
          completed: taskData.completed || false,
          file_path: taskData.file_path || null,
          file_url: taskData.file_url || null,
          file_name: taskData.file_name || null,
          file_type: taskData.file_type || null,
          file_size: taskData.file_size || null,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Task added successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Error adding task:", error);
    return { data: null, error: error.message || error };
  }
};

export const getTasks = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("deadline", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { data: [], error };
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating task:", error);
    return { data: null, error };
  }
};

export const deleteTask = async (taskId) => {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error };
  }
};

/**
 * Documents Functions
 */

export const uploadTaskFile = async (file) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/tasks/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(fileName);

    return {
      data: {
        path: fileName,
        url: publicUrl,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error uploading task file:", error);
    return { data: null, error };
  }
};

export const uploadDocument = async (file, className) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(fileName);

    // Store document metadata in database
    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          user_id: user.id,
          document_title: file.name,
          document_type: file.type,
          class: className,
          file_path: fileName,
          file_url: publicUrl,
          file_size: file.size,
        },
      ])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { data: null, error };
  }
};

export const getDocuments = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { data: [], error };
  }
};

export const deleteDocument = async (documentId, filePath) => {
  try {
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete document metadata from database
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { error };
  }
};

export const downloadDocument = async (filePath, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from("documents")
      .download(filePath);

    if (error) throw error;

    // Create a download link
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    return { error: null };
  } catch (error) {
    console.error("Error downloading document:", error);
    return { error };
  }
};

/**
 * Task Files Functions (Multiple files per task)
 */

export const addTaskFile = async (taskId, file) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Upload file to storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/tasks/${taskId}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(fileName);

    // Store file metadata in task_files table
    const { data, error } = await supabase
      .from("task_files")
      .insert([
        {
          task_id: taskId,
          user_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
        },
      ])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error("Error adding task file:", error);
    return { data: null, error };
  }
};

export const getTaskFiles = async (taskId) => {
  try {
    const { data, error } = await supabase
      .from("task_files")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching task files:", error);
    return { data: [], error };
  }
};

export const deleteTaskFile = async (fileId, filePath) => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error } = await supabase
      .from("task_files")
      .delete()
      .eq("id", fileId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting task file:", error);
    return { error };
  }
};
