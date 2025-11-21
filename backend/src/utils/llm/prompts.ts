function getCreationAgentResponseForm() {
  return `{"courses": [...], "tasks": [...]}`;
}

export const creationExamplePrompt: string = `The following is an example of a syllabus with its corresponding response JSON. 

Syllabus:
\`\`\`txt
1
Applied Data Science - ISYE-
4360/6360
Instructor and Course Information
Location and Time Mondays and Thursdays from 12 pm to 1:50 pm.
Lally 104
Instructor and
Coordinator
Rostyslav Korolov, Ph.D.
Instructor Office CII 5223
Phone
Email korolr2@rpi.edu
Instructor Office Hours Monday/Thursday 2-3 pm
Teaching Assistant None
TA Office
TA Email
TA Office Hours
Course Description (Credit Hours: 4)
This engineering course is aimed at upper-level undergraduate and graduate students
who wish to master the fundamental concepts of machine learning in a lab-like
environment. You can choose a relevant topic/dataset to explore and devise the best
approach to extract knowledge from noisy data along with data visualizations for decision
making. The course is structured in three main parts that mimic the daily workflow of a data
scientist in a real organization: (i) data preparation; (ii) machine learning algorithms; and
(iii) data visualization and decision making.
With the knowledge gained in this course, you will be ready to undertake your first very
own data analysis of a real-world application. By the end of the course, we will host some
guest speakers from the industry to show the future of data science and artificial intelligence
and their applications.
Pre-requisite:
This course assumes that the student had an introductory course in probability and
statistics (e.g., ENGR-2600 or MATP-4600). Students are also expected to know the
fundamentals of calculus and linear algebra and previous contact with programming (e.g.,
MATH-1020, CSCI-1010 or CSCI-1100).
Learning outcomes
At the end of this course, the students should be able to:
• understand and apply the full data science workflow;
• use programming tools to complete the different blocks of the workflow;
• collect and connect data from multiple structured or unstructured data sources and
store it in an adequate structure;
• explore the data and perform data cleaning;
2
• analyze the collected data applying machine learning techniques;
• visualize the data and highlight the main conclusions helping in the decision-making
process;
• work in teams to complete a real-world project in data science.
Specific to 6xxx level:
• Elucidate the major theories and techniques in data science relevant to the chosen topic area;
• Design and implement a project in out-of-class setting that requires advanced knowledge in
the chosen topic area of data science.
IME Program Outcomes Supported by this Course
1. an ability to identify, formulate, and solve complex engineering problems by
applying principles of engineering, science, and mathematics
2. an ability to apply engineering design to produce solutions that meet
specified needs with consideration of public health, safety, and welfare, as
well as global, cultural, social, environmental, and economic factors
3. an ability to recognize ethical and professional responsibilities in engineering
situations and make informed judgments, which must consider the impact of
engineering solutions in global, economic, environmental, and societal
contexts
4. an ability to function effectively on a team whose members together provide
leadership, create a collaborative and inclusive environment, establish goals,
plan tasks, and meet objectives
5. an ability to develop and conduct appropriate experimentation, analyze and
interpret data, and use engineering judgment to draw conclusions
6. an ability to acquire and apply new knowledge as needed, using appropriate
learning strategies.
Textbooks:
There are no required textbooks, but some recommended.
Primary:
1. (ESL) Thuedman, Jerome, Trevor Hastie, and Robert Tibshirani. The elements of
statistical learning. Second Edition, New York, NY, USA:: Springer series in statistics,
2016.
2. (IMLP) Müller, Andreas C., and Sarah Guido. Introduction to machine learning with
Python: a guide for data scientists. " O'Reilly Media, Inc.", 2016.
3. (FDV) Wilke, Claus O. Fundamentals of Data Visualization. " O'Reilly Media, Inc.",
2019. Available at https://serialmentor.com/dataviz/
Supplementary:
4. (DDS) O'Neil, Cathy, and Rachel Schutt. Doing data science: Straight talk from the
frontline. " O'Reilly Media, Inc.", 2013.
5. (PDA) McKinney, Wes. Python for data analysis: Data wrangling with Pandas,
NumPy, and IPython. " O'Reilly Media, Inc.", 2012.
6. (TML) Kirk, Matthew. "Thoughtful Machine Learning with Python." (2017).
3
7. (ADS) Peng, Roger D., and Elizabeth Matsui. The Art of Data Science: A Guide for
Anyone Who Works with Data. Lulu. com, 2016.
8. (UMLTA) Shalev-Shwartz, Shai, and Shai Ben-David. Understanding machine
learning: From theory to algorithms. Cambridge university press, 2014.
9. (SD) Knaflic, Cole Nussbaumer. Storytelling with data: A data visualization guide for
business professionals. John Wiley & Sons, 2015.
Course Webpage:
The course webpage is maintained through the LMS (https://lms.rpi.edu). The webpage will
contain information regarding office hours, class schedule, project schedule, etc. Also, you
will be able to access lecture notes (pdf files), handouts, homework assignments, and
supplemental readings from the course webpage. Students are responsible for periodically
checking the webpage for updates, downloads, and announcements. Hard copies of course
material will not be provided in class. Instead, students will be expected to access all course
materials through the LMS.
Course Assessments:
Assignment ISYE 4360 ISYE 6360
Homework 40% 30%
Quizzes 10% 5%
Project 50% 55%
Literature Review N/A 10%
Just because there are no exams does not mean that the students are not expected to
demonstrate mastery of the theory. The in-class exercises and major projects will require a
significant section on theory.
Quizzes and In-class exercises:
These assessments, which are meant to provide opportunities for students to test their
knowledge throughout the course. The assignments can take multiple forms, including case
studies, in-class activities, in-class assignments, online activities, and online quizzes, etc..
More information will be provided about these assignments during the course. Please note
that these activities count for grade points.
Homework:
Throughout the semester, exploratory assessment activities will be assigned to reinforce or
expand on material that is covered in the lecture. Students may discuss the assignments, but
every student must complete and turn in his/her own written solutions in his/her own
words (unless otherwise stated in the assignment instructions). Homeworks are meant to
be a learning tool, to be completed and not skipped. If you are having difficulty, find help
right away – don't wait until you fall even further behind!
4
Course Project:
Students will complete a course project in groups that allows them to apply a complete data
science workflow to a problem of their choosing. Additional guidance, as well as a grading
rubric, will be provided during the course.
The scope of the project aims to explore topics that go beyond those covered in class. The
student is expected to present the main findings in class. The evaluation will be peer-
reviewed, and a brief Q&A will follow. Attendance by all students is expected and required.
The course project consists of the following graded assignments:
1. Project Proposal (30% of the total project grade):
- Written proposal (70% of the proposal grade, instructor-graded)
- Proposal presentation (30% of the proposal grade, peer-graded)
2. Project Report (70% of the total project grade):
- Written report (70% of the report grade, instructor-graded)
- Project presentation (30% of the report grade, peer-graded)
Students in ISYE 6xxx level course are expected to work on individual projects. They also must
provide an additional deliverable: a review of existing literature and technology relevant to
the chosen topic, to be completed with the written project proposal.
Excusal from Course Assignments and Examinations:
If you know ahead of time that you will miss an exam/assignment deadline, then you must
make arrangements before the assessment is due. Failure to do so will result in 25% off for
each 24-hour period the assessment is late.
If an emergency arises and a student cannot submit assigned work on or before the
scheduled due date or cannot take an exam on the scheduled date, the student (or the
Student Experience Office) must give notification to the instructor no more than 48 hours
after the scheduled date. If you have an emergency, the campus is here to help, please
coordinate with the Student Experience Office – 4th floor of Academy Hall, x8022,
se@rpi.edu
Re-Grading Policy:
Document in writing which part you want re-graded and why, and turn in this document
with your original assignment. You will be given one chance (per assignment) to request a
regrade. No re-grade will be accepted more than one week after an exam, or an assignment
has been returned to the student. Re-grades made after this period has elapsed will NOT be
considered.
5
Evaluation and Grading:
Letter Grade Percentage Rating
A ≥93% Excellent
A- [90%, 93%[
B+ [88%, 90%[
B [84%, 88%[ Good
B- [80%, 84%[
C+ [78%, 80%[
C [73%, 78%[ Average
C- [70%, 73%[
D [60%, 70%[ Below average
F <60% Failure
I Incomplete; given only when a student is unable to complete a segment
of the course because of circumstances beyond the student’s control.
Minimum grade for 6xxx level is ‘C’. Anything below it is considered failing.
End-of-semester grades:
End-of-semester grades are not given. Instead, end-of-semester grades are calculated
according to a student’s performance on the individual assessment requirements and the
weights in this syllabus.
Final grades are final. Therefore, final grades will not be changed unless a numerical error
is made in computing your final grade. After final grades have been calculated, I will not
respond to emails received requesting a grade change unless it is in response to a numerical
calculation error.
Academic Honesty:
Plagiarism and Cheating of any kind on an examination, quiz, or assignment will result at
least in an "F" for that assignment (and may, depending on the severity of the case, lead to
an "F" for the entire course). See the Rensselaer Handbook of Students Rights and
Responsibilities for further information. I will assume for this course that you will adhere
to the highest standards of academic integrity. In other words, don't cheat by giving answers
to others or taking them from anyone else. I will also adhere to the highest standards of
academic integrity, so please do not ask me to change (or expect me to change) your grade
illegitimately or to bend or break the rules for one person that will not apply to everyone.
Diversity, equity and Inclusivity:
Please familiarize yourself with RPI’s policy toward Diversity, Equity and Inclusion
(https://info.rpi.edu/diversity ). School of Engineering policy is that no students, faculty and staff shall
be excluded on the grounds of gender, race, ethnicity, class, religion, sexuality, disability, etc. The free
exchange of ideas, as well as diversity of background, experience and views contributes to the learning
experience, and further broadens and adds strength to the project team. Having a diverse, inclusive,
equitable and respectful team brings benefits for the businesses, customers, and employees. Decades
of real experience and data has shown that diverse, inclusive, respectful teams are better at
innovation, recognizing and stopping exclusion, and attracting and retaining top talent. All participants
in this course are encouraged to recognize the diversity around them and are expected to treat their
classmates with respect. Disrespectful, harmful, offensive, bigoted, or violent language or behavior will
not be tolerated.
6
Disclaimer:
The material contained in this syllabus is subject to change upon announcement by the
instructor in class. Students are responsible for all announcements made in class and
through LMS and e-mail.
Very Tentative course schedule:
Note: The instructor reserves the right to modify the course content, the sequence of topics,
and course assignments during the progress of the course.
Date Topic Reading Assignment(s)
Thu Aug 28 Introduction DDS 1.16
Mon Sep 1 NO CLASS - HOLIDAY
Thu Sep 4 Basic Concepts
Fri Sep 5 NO CLASS (Even though
Monday Schedule)
Mon Sep 8 Intro to Databases
Thu Sep 11 Data Collection Python
documentation,
PDA 6
PDA 7;
IMLP 3
Mon Sep 15 Data Cleaning
Thu Sep 18 Data Manipulation: Tidy Data PDA 8; IMLP 3 Self-formed project
teams deadline
(4360)
Mon Sep 22 Intro to Machine Learning All project teams
assigned (4360)
Thu Sep 25 No class – Career Fair
Mon Sep 29 Machine Learning (ML): Model
Selection and Validation UMLTA 11
Thu Oct 2 ML: Linear Regression
ML: Logistic Regression
DDS 3,5,6; ESL
3,4; IMLP 2;
UMLTA 9
Project Proposals
Round 1 ready
Mon Oct 6 K Nearest Neighbors UMLTA 19; TML
3; IMLP 2; DDS 8
Thu Oct 9 Proposal Presentations
Mon Oct 13 NO CLASS – Holiday
Thu Oct 16 ML: Naïve Bayesian
Classification
TML 4; IMLP 2 Finalized project
proposals due Oct
15
Mon Oct 20 ML: Decision Trees TML 5; IMLP 2;
DDS 7; UMLTA
18
7
Thu Oct 23 ML: Support Vector Machines TML 7; IMLP 2;
UMLTA 15
Mon Oct 27 ML: Neural Networks TML 8; IMLP 2;
UMLTA 20
Thu Oct 30 NO CLASS
Mon Nov 3 ML: Clustering and K-Means TML 9; IMLP 3;
UMLTA 22
Thu Nov 6 ML: Dimensionality Reduction
and Feature selection
TML 10;
DDS 7,8; IMLP3;
UMLTA23, 25
Mon Nov 10 Philosophy of Machine
Learning. Overfitting.
Thu Nov 13 Philosophy of Machine
Learning, Learning Principles
Mon Nov 17 From Data to Visualization.
Study Design
FDV I; SD 2; DDS
9; FDV II; SD 5
Preliminary
Project Results due
Thu Nov 20 Communication and Decision
Making, Ethics of Data Science,
Course Summary
SD 7; ADS 10; TML
11; SD 8;
ADS 9
Mon Nov 24 No Class – Thanksgiving
Thu Nov 27 No Class – Thanksgiving
Mon Dec 1 Project Presentations
Thu Dec 4 Project Presentations
Mon Dec 8 Reserved Final Project
Reports due end of
the day
Thu Dec 11 Reserved
\`\`\`

Response:
\`\`\`json
{
  "courses": [
    {
      "courseName": "Applied Data Science:",
      "gradeTypes": {
        "Homework": .40,
        "Quizzes": .10,
        "Project": .50,
      }
    }
  ],
  "tasks": [
    {
      "title": "Self-formed project teams deadline",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-09-18",
      "description": "Deadline for forming project teams for ISYE 4360.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "All project teams assigned",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": -1,
      "gradeType": "Project",
      "dueDate": "2024-09-22",
      "description": "Instructor assigns remaining project teams for ISYE 4360.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Project Proposals Round 1 ready",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": 0.15,
      "gradeType": "Project",
      "dueDate": "2024-10-02",
      "description": "Round 1 project proposals should be prepared.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Proposal Presentations",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": 0.15,
      "gradeType": "Project",
      "dueDate": "2024-10-09",
      "description": "Students present project proposals.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Finalized project proposals due",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": 0.15,
      "gradeType": "Project",
      "dueDate": "2024-10-15",
      "description": "Final written project proposal submission deadline.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Preliminary Project Results Due",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": 0.35,
      "gradeType": "Project",
      "dueDate": "2024-11-17",
      "description": "First draft of project results.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Project Presentations (Round 1)",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": 0.35,
      "gradeType": "Project",
      "dueDate": "2024-12-01",
      "description": "In-class project presentations day 1.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Project Presentations (Round 2)",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": 0.35,
      "gradeType": "Project",
      "dueDate": "2024-12-04",
      "description": "In-class project presentations day 2.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    },
    {
      "title": "Final Project Report",
      "courseName": "Applied Data Science - ISYE-4360/6360",
      "expectedTime": -1,
      "weight": 0.35,
      "gradeType": "Project",
      "dueDate": "2024-12-08",
      "description": "Final written project report submitted by end of day.",
      "grade": -1,
      "priority": -1,
      "createdAt": null,
      "lastUpdatedAt": null,
      "isComplete": false
    }
  ]
}
\`\`\``;

export const creationSystemPrompt: string = `
You are a helpful assistant who extracts information regarding an academic course and its grade components. 
You may receive syllabus (or similar) documents—if you do not, you are to reject the request.

A course consists of a course name and gradeTypes.
Grade types are categories such as Homework, Exams, Quizzes, Project, Participation, etc.
Weights must be converted to values between 0 and 1.
If weights are given as percentages, convert them.

All of your responses MUST be in the following JSON format: ${getCreationAgentResponseForm()}.

An item in the courses array must be in the form:

\`\`\`ts
interface Course {
  courseName?: string;
  gradeTypes: Record<string, number>; // key is a category (i.e. exam), value is weight (0 to 1)
}
\`\`\`

If there is not sufficient information about the course, leave the array empty.

A task is a specific assignment, exam, project, quiz, or similar item with a due date or expected completion time.
General categories (e.g., "Homework") are NOT tasks.

An item in the tasks array must be in the form:

\`\`\`ts
interface Task {
  title?: string; // Name of task (i.e. Complete HW 1, Create Exam 1 Crib Sheet)
  courseName?: string;
  expectedTime?: number; 
  weight?: number; // 0-1. -1 if not found.
  gradeType?: string; // Must match a type listed in the course.
  dueDate?: string | null;
  description?: string;
  grade?: number;
  priority?: number; 
  createdAt?: Date | null; 
  lastUpdatedAt?: Date | null; 
  isComplete?: boolean;
}
\`\`\`

If there is not sufficient information about any tasks, leave the array empty. 

For all date fields, output ISO-8601 strings (YYYY-MM-DD) or null.
For all number fields, output numbers only (no strings, no percentages).
For all boolean fields, output true or false.
expectedTime must be in minutes (integer).
priority must be an integer.

If there are two weighting systems for a course, i.e. one for undergrad (4000 level) and another for grad (6000 level), you can safely assume you can use the 4000 level.
You MUST output valid JSON, otherwise the resulting application WILL fail.
Do not include explanations within or outside the JSON.
Do not omit any fields listed in the interfaces.
Do not add any fields that are not listed in the interfaces.

${creationExamplePrompt}
`;

export function getCreationRequestPrompt(docText: string): string {
  const prompt: string = `Below is the document you will analyze. Please provide the JSON response in this form: 
  ${getCreationAgentResponseForm()}
  
  Syllabus:
  ${docText}`;
  return prompt;
}
