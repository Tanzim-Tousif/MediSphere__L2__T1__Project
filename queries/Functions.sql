--01
--function to find doctorid through emailAddress
CREATE OR REPLACE FUNCTION get_doctor_id(email_address IN VARCHAR2) RETURN NUMBER
AS
    doctor_id NUMBER;
BEGIN
    SELECT DoctorID INTO doctor_id
    FROM DOCTOR
    WHERE EmailAddress = email_address;

    RETURN doctor_id;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN NULL; -- Return NULL if the email address is not found
    WHEN DUP_VAL_ON_INDEX THEN
        RETURN -1; -- Return -1 to indicate email address uniqueness violation
END get_doctor_id;



--02
-- function to retrieve APPOINTMENT date from schedule id
CREATE OR REPLACE FUNCTION GET_APPOINTMENT_DAY(SCHEDULE_ID IN NUMBER) 
RETURN DATE 
IS
    APPOINTMENT_DAY DATE;
BEGIN
    SELECT DAY INTO APPOINTMENT_DAY 
    FROM DoctorSchedule 
    WHERE ScheduleID = SCHEDULE_ID;

    RETURN APPOINTMENT_DAY;
-
    WHEN NO_DATA_FOUND THEN
        RETURN NULL; -- Or handle the exception as per your requirement
END;