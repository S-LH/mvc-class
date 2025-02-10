--ѧ����
Create table Student(
  StudentID int primary key Identity(1,1),
  StudentName nvarchar(20),
  Sex nvarchar(20),
  StudentNum nvarchar(20),
  Nation nvarchar(20),
  PoliticsStatus nvarchar(20),
  Position nvarchar(20),
  Major nvarchar(20),
  RecruitType nvarchar(20),
  Dorm nvarchar(20),
  Hometown nvarchar(20),
  ClassID int,
  TeacherID int
)
--����Ա��
Create table Teacher(
TeacherID int primary key Identity(1,1),
TeacherName nvarchar(20),
Phone nvarchar(20),
Pwd nvarchar(20),
)
--�༶��
Create table Class(
ClassID int primary key Identity(1,1),
ClassName nvarchar(20),
TeacherID int
)
--�����
Create table Notice(
NoticeID int primary key Identity(1,1),
Title nvarchar(20),
Content text,
TeacherID int,
Time date default(getdate())
)

--�γ̱�
Create table Course(
CourseID int primary key Identity(1,1),
CourseName nvarchar(50),
Credit nvarchar(20),
CreditTime nvarchar(20),
Rate nvarchar(20),
Rteacher nvarchar(20),
)

--�ɼ���
Create table Grade(
GradeID int primary key Identity(1,1),
Score nvarchar(20),
CourseID int ,
StudentID int
)