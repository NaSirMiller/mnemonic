import { Request, Response } from "express";

import admin from "../firebase_admin";
import { firebaseRepo } from "../repositories/firebaseRepository";
import { Course } from "../models/course";

export async function getCourse (request: Request, response: Response){
    const {userID} = request.params
    const coursename: string | undefined = request.query.coursename as string | undefined;
    let coursesRetrieved: Course[];
    try{
        if (coursename == undefined){
            coursesRetrieved = await firebaseRepo.getAllCourses(userID);
        } else {
            let course: Course = await firebaseRepo.getSingleCourse(userID, coursename);
            coursesRetrieved = [course];
        }
    } catch (err) {
        let errorMessage: string;
        if (err instanceof Error) {
        errorMessage = err.message;
        console.error();
        } else {
        (errorMessage = "Unknown error:"), err;
        }
        console.log(errorMessage);
        return response.json({ message: errorMessage }).status(400);
    }
    return response.json({
        message: "Successfully retrieved courses",
        courses: coursesRetrieved
    });
};
export async function createCourse (request: Request, response: Response){
    const coursePayload = request.body;
    let createdCourse: Course;
    try{
        createdCourse = await firebaseRepo.createCourse(coursePayload as Course)
    } catch (err) {
        let errorMessage: string;
        if (err instanceof Error) {
        errorMessage = err.message;
        console.error();
        } else {
        (errorMessage = "Unknown error:"), err;
        }
        console.log(errorMessage);
        return response.json({ message: errorMessage }).status(400);
    }
    return response.json({
        message: "Successfully created a course",
        course: createdCourse
    }).status(200);
};
export async function updateCourse (request: Request, response: Response){
    const {userID, courseName, coursePayload} = request.body;
    try{
        await firebaseRepo.updateCourse(userID, courseName, coursePayload as Course);
    } catch (err) {
        let errorMessage: string;
        if (err instanceof Error) {
        errorMessage = err.message;
        console.error();
        } else {
        (errorMessage = "Unknown error:"), err;
        }
        console.log(errorMessage);
        return response.json({ message: errorMessage }).status(400);
    }
    return response
    .json({
      message: `Successfully updated course ${courseName}.`,
    })
    .status(200);
};
export async function deleteCourse (request: Request, response: Response){
     const { userId, courseName } = request.params;
    try{
        firebaseRepo.deleteCourse(userId, courseName);
    } catch (err) {
        let errorMessage: string;
        if (err instanceof Error) {
        errorMessage = err.message;
        console.error();
        } else {
        (errorMessage = "Unknown error:"), err;
        }
        console.log(errorMessage);
        return response.json({ message: errorMessage }).status(400);
    }
    return response
    .json({ message: `Successfully deleted course ${courseName}` })
    .status(200);
};