import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handlers.js";
import ApiError from "../utils/api-error.js";
import mongoose from "mongoose";

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("createdBy", "username fullName avatar");

    return res
        .status(200)
        .json(
            new ApiResponse(200, notes, "Notes fetched successfully")
        );
});

const getNoteById = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await ProjectNote.findById(noteId)
        .populate("createdBy", "username fullName avatar");

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, note, "Note fetched successfully")
        );
});

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Note content is required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await ProjectNote.create({
        project: new mongoose.Types.ObjectId(projectId),
        content,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    const populatedNote = await ProjectNote.findById(note._id)
        .populate("createdBy", "username fullName avatar");

    return res
        .status(201)
        .json(
            new ApiResponse(201, populatedNote, "Note created successfully")
        );
});

const updateNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Note content is required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await ProjectNote.findById(noteId);
    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // Check if current user is the creator
    if (note.createdBy.toString() !== req.user._id) {
        throw new ApiError(403, "You are not authorized to update this note");
    }

    note.content = content;
    await note.save();

    const populatedNote = await ProjectNote.findById(note._id)
        .populate("createdBy", "username fullName avatar");

    return res
        .status(200)
        .json(
            new ApiResponse(200, populatedNote, "Note updated successfully")
        );
});

const deleteNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await ProjectNote.findById(noteId);
    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // Check if current user is the creator
    if (note.createdBy.toString() !== req.user._id) {
        throw new ApiError(403, "You are not authorized to delete this note");
    }

    await ProjectNote.findByIdAndDelete(noteId);

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Note deleted successfully")
        );
});

export {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};
