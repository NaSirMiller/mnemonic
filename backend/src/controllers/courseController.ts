import { Request, Response } from "express";
import { firebaseRepo } from "../repositories/firebaseRepository";
import { Course } from "../models/course";

export async function getCourse (request: Request, response: Response){
    const {userId} = request.params;
    const courseId: string | undefined = request.query.courseId as string | undefined;
    let coursesRetrieved: Course[];
    try{
        if (courseId == undefined){
            coursesRetrieved = await firebaseRepo.getAllCourses(userId);
        } else {
            let course: Course = await firebaseRepo.getSingleCourse(userId, courseId);
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
}

export async function createCourse (request: Request, response: Response){
    const coursePayload = request.body;
    let createdCourse: Course;
    try{
        createdCourse = await firebaseRepo.createCourse(coursePayload as Course);
        return response.json({
            message: "Successfully created a course",
            course: createdCourse
        }).status(200);
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
    
};
//Needs to be updated to change the current grade and grade types
export async function updateCourse (request: Request, response: Response){
    const {userId, courseId, courseName} = request.body;
    try{
        await firebaseRepo.updateCourse(userId, courseId, request.body as Course);
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
     const { userId, courseId } = request.params;
    try{
        firebaseRepo.deleteCourse(userId, courseId);
        return response.json({ message: `Successfully deleted course ${courseId}` }).status(200);
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
    
};