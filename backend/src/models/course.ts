export interface Course {
    userId: string;
    courseId: string;
    courseName: string;
    currentGrade: number;
}

export type CourseUpdate = Partial<Course>;

export class CourseModel implements Course {
    userId: string;
    courseName: string;
    currentGrade: number;
    courseId: string;

    constructor(data: Course | CourseUpdate){
        if (CourseModel._isFullCourse(data)) {
            this._validateCourse(data);
        }
        this.userId! = data.userId!;
        this.courseId! = data.courseId!;
        this.courseName! = data.courseName!;
        this.currentGrade! = 0;
    }

    private static _isFullCourse(data: Course | CourseUpdate): data is Course {
        return (typeof data.userId === "string" && typeof data.courseName === "string");
    }
    private _validateCourse(data : Course): void {
        if (!data.userId || typeof data.userId !== "string")
            throw new Error("UserId must be a string");
        if (!data.courseName || typeof data.courseName !== "string")
            throw new Error("courseName must be a string");
    }

    public toJson(): Course {
        return {
            userId: this.userId,
            courseId: this.courseId,
            courseName: this.courseName,
            currentGrade: this.currentGrade
        };
    }

    static fromJson(json : Course): CourseModel {
        return new CourseModel({
            userId: json.userId,
            courseId: json.courseId,
            courseName: json.courseName,
            currentGrade: json.currentGrade
        })
    } 
}

