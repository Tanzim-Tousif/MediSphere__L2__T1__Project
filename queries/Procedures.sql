--01(done)
--procedure insert_in_appointment_table
CREATE OR REPLACE PROCEDURE insert_in_appointment_table (
    p_schedule_id IN NUMBER,
    p_patient_id IN NUMBER,
    p_serial_no IN NUMBER
) AS
BEGIN
    INSERT INTO appointment (STATUS, SCHEDULEID, PATIENTID, SERIALNO)
    VALUES (0, p_schedule_id, p_patient_id, p_serial_no);
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END insert_in_appointment_table;

--02(done)
--for isertion in PRESCRIPTION url
CREATE OR REPLACE PROCEDURE insert_prescription (
    p_url IN VARCHAR2,
    p_appointment_id IN NUMBER
) AS
BEGIN
    INSERT INTO Prescription (url, AppointmentID)
    VALUES (p_url, p_appointment_id);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END insert_prescription;


--03(done)
--for insertion in the doctor schedule  table
CREATE OR REPLACE PROCEDURE insert_doctor_schedule (
    p_id IN NUMBER,
    p_dt IN VARCHAR2,
    p_starttimeam IN VARCHAR2,
    p_endtimeam IN VARCHAR2,
    p_capacity IN NUMBER
) AS
BEGIN
    INSERT INTO doctorschedule (doctorid, day, starttime, endtime, capacity, patient, status)
    VALUES (p_id, TO_DATE(p_dt, 'YYYY-MM-DD'), p_starttimeam, p_endtimeam, p_capacity, 0, 0);
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END insert_doctor_schedule;

--04
--for patient profile UPDATE
CREATE OR REPLACE PROCEDURE update_patient (
    p_patient_id IN NUMBER,
    p_firstname IN VARCHAR2,
    p_lastname IN VARCHAR2,
    p_gender IN VARCHAR2,
    p_contactnumber IN VARCHAR2,
    p_address IN VARCHAR2,
    p_password IN VARCHAR2,
    p_weight IN NUMBER,
    p_height IN NUMBER,
    p_vaccinationhistory IN VARCHAR2,
    p_bloodpressure IN VARCHAR2,
    p_bmi IN NUMBER,
    p_heartrate IN NUMBER
) AS
BEGIN
    UPDATE Patient
    SET FIRSTNAME = p_firstname,
        LASTNAME = p_lastname,
        GENDER = p_gender,
        CONTACTNUMBER = p_contactnumber,
        ADDRESS = p_address,
        PASSWORD = p_password
    WHERE PATIENTID = p_patient_id;

    UPDATE HEALTHRECORDS
    SET WEIGHT = p_weight,
        HEIGHT = p_height,
        VACCINATIONHISTORY = p_vaccinationhistory,
        BLOODPRESSURE = p_bloodpressure,
        BMI = p_bmi,
        HEARTRATE = p_heartrate
    WHERE PATIENTID = p_patient_id;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END update_patient;


--05(done)
--to delete APPOINTMENT from APPOINTMENT table
CREATE OR REPLACE PROCEDURE delete_appointment (
    p_appointment_id IN NUMBER
) AS
BEGIN
    DELETE FROM APPOINTMENT WHERE APPOINTMENTID = p_appointment_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END delete_appointment;

--06
--update schedule time
CREATE OR REPLACE PROCEDURE updatescheduletime (
    newstarttime IN VARCHAR2,
    newendtime IN VARCHAR2,
    newcapa IN NUMBER,
    ID IN NUMBER
)
AS
BEGIN
    UPDATE doctorschedule
    SET starttime = newstarttime,
        endtime = newendtime,
        capacity = newcapa
    WHERE scheduleid = ID;
END;
