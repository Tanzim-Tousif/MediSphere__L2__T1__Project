--01
--after uploading prescription from doctor end the APPOINTMENT status will be changed
CREATE OR REPLACE TRIGGER update_appointment_status
AFTER INSERT ON Prescription
FOR EACH ROW
DECLARE
    v_status NUMBER;
BEGIN
    SELECT Status INTO v_status
    FROM Appointment
    WHERE AppointmentID = :new.AppointmentID;
    IF v_status = 0 THEN
        UPDATE Appointment
        SET Status = 1
        WHERE AppointmentID = :new.AppointmentID;
    END IF;
END;



--02
--DELETEDAPPOINTMENTS will be stored in the backup table
CREATE OR REPLACE TRIGGER trg_backup_deleted_appointments
AFTER DELETE ON Appointment
FOR EACH ROW
BEGIN
    INSERT INTO DeletedAppointments (AppointmentID, Status, ScheduleID, PatientID, SerialNo)
    VALUES (:old.AppointmentID, :old.Status, :old.ScheduleID, :old.PatientID, :old.SerialNo);
END;



--03
--when a patient deletes an appointment capacity of corresponding DOCTORSCHEDULE gets incremented by 1
CREATE OR REPLACE TRIGGER appointment_delete_trigger_increment
AFTER DELETE ON Appointment
FOR EACH ROW
DECLARE
    v_schedule_id NUMBER;
BEGIN
    v_schedule_id := :OLD.ScheduleID;
    UPDATE DoctorSchedule
    SET capacity = capacity + 1
    WHERE ScheduleID = v_schedule_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END appointment_delete_trigger_increment;


--04
--trigger for appointment in logtable
CREATE OR REPLACE TRIGGER appointment_insert_trigger
AFTER INSERT ON appointment
FOR EACH ROW
DECLARE
    v_user_id   Patient.PatientID%TYPE;
    v_user_name Patient.FirstName%TYPE;
BEGIN
    -- Retrieve user information from Patient table based on PATIENTID
    SELECT PatientID, FirstName INTO v_user_id, v_user_name
    FROM Patient
    WHERE PatientID = :NEW.PATIENTID;

    -- Insert log record into LOGTABLE
    INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME)
    VALUES ('insert_in_appointment_table', 
            'SCHEDULEID=' || :NEW.SCHEDULEID || ', PATIENTID=' || :NEW.PATIENTID || ', SERIALNO=' || :NEW.SERIALNO,
            v_user_id, v_user_name);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL; -- Do nothing if the patient does not exist
    WHEN OTHERS THEN
        -- Log any errors encountered during trigger execution
        INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME)
        VALUES ('insert_in_appointment_table', 
                'SCHEDULEID=' || :NEW.SCHEDULEID || ', PATIENTID=' || :NEW.PATIENTID || ', SERIALNO=' || :NEW.SERIALNO,
                NULL, NULL);
END;





--05
--prescription_insert_trigger in LOGTABLE
CREATE OR REPLACE TRIGGER prescription_insert_trigger
AFTER INSERT ON Prescription
FOR EACH ROW
DECLARE
    v_user_id   Doctor.DoctorID%TYPE;
    v_user_name Doctor.FirstName%TYPE;
BEGIN
    -- Retrieve user information from Doctor table based on the associated schedule
    SELECT d.DoctorID, d.FirstName INTO v_user_id, v_user_name
    FROM Doctor d
    JOIN DoctorSchedule ds ON d.DoctorID = ds.DoctorID
    WHERE ds.ScheduleID IN (SELECT ScheduleID FROM Appointment WHERE AppointmentID = :NEW.AppointmentID);

    -- Insert log record into LOGTABLE
    INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME)
    VALUES ('insert_prescription', 
            'URL=' || :NEW.url || ', AppointmentID=' || :NEW.AppointmentID,
            v_user_id, v_user_name);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL; -- Do nothing if the doctor does not exist
    WHEN OTHERS THEN
        -- Log any errors encountered during trigger execution
        INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME)
        VALUES ('insert_prescription', 
                'URL=' || :NEW.url || ', AppointmentID=' || :NEW.AppointmentID,
                NULL, NULL);
END;






--06
-- set doctor schedule in LOGTABLE
CREATE OR REPLACE TRIGGER set_doctor_schedule_trigger
AFTER INSERT ON doctorschedule
FOR EACH ROW
DECLARE
    v_doctor_id   Doctor.DoctorID%TYPE;
    v_doctor_name Doctor.FirstName%TYPE;
BEGIN
    -- Retrieve doctor information from Doctor table based on the DoctorID
    SELECT d.DoctorID, d.FirstName
    INTO v_doctor_id, v_doctor_name
    FROM Doctor d
    WHERE d.DoctorID = :NEW.doctorid;

    -- Insert log record into LOGTABLE
    INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME)
    VALUES ('insert_doctor_schedule', 
            'DoctorID=' || v_doctor_id || ', Day=' || :NEW.day || ', Starttime=' || :NEW.starttime || ', Endtime=' || :NEW.endtime || ', Capacity=' || :NEW.capacity,
            v_doctor_id, v_doctor_name);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL;
    WHEN OTHERS THEN
        NULL; 
END set_doctor_schedule_trigger;



--07
--update patient profile for logtable
CREATE OR REPLACE TRIGGER update_patient_trigger
AFTER UPDATE ON Patient
FOR EACH ROW
BEGIN
    -- Insert log record into LOGTABLE
    INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS,USER_ID,USER_NAME)
    VALUES ('update_patient', 'PatientID=' || :	NEW.PatientID , :OLD.PatientID, :OLD.FIRSTNAME);
END update_patient_trigger;





--08
--deleted appointments in LOGTABLE
CREATE OR REPLACE TRIGGER appointment_delete_trigger
AFTER DELETE ON Appointment
FOR EACH ROW
DECLARE
    v_username VARCHAR2(100);
BEGIN
    SELECT FirstName || ' ' || LastName
    INTO v_username
    FROM Patient
    WHERE PatientID = :OLD.PatientID;
    INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME)
    VALUES ('delete_appointment', 'AppointmentID=' || :OLD.AppointmentID, :OLD.PatientID, v_username);
END appointment_delete_trigger;



--09
--to craete an empty row in healthrecord table for new signup
CREATE OR REPLACE TRIGGER Insert_HealthRecord
AFTER INSERT ON Patient
FOR EACH ROW
BEGIN
    INSERT INTO HealthRecords (PatientID) VALUES (:NEW.PatientID);
END;



--10
--rating calculated after reveiw
CREATE OR REPLACE TRIGGER update_doctor_rating
BEFORE INSERT ON Review
FOR EACH ROW
DECLARE
    total_rating NUMBER;
    total_appointments NUMBER;
    avg_rating number(10,1);
    id number;
BEGIN

   select distinct(d.doctorid) into id
   from doctor d left join doctorschedule ds on (d.doctorid = ds.doctorid)
   left join appointment a on (a.ScheduleID = ds.ScheduleID)
   WHERE a.appointmentid = :new.appointmentid;


    -- Get the total rating and total appointments for the doctor
    SELECT COUNT(a.appointmentid) into total_appointments
    from doctor d
    left join doctorschedule ds on(d.DOCTORID = ds.DOCTORID)
    left join appointment a on(a.scheduleid = ds.scheduleid)
    GROUP BY D.DOCTORID
    having d.doctorid = id;

    select rating into total_rating
    from doctor where doctorid = id;
    -- Calculate the average rating
    IF total_appointments > 0 THEN
        avg_rating := (total_rating + :NEW.Rating) / (total_appointments);
    ELSE
        avg_rating := :NEW.Rating;
    END IF;

    -- Update the doctor's rating
    UPDATE Doctor
    SET Rating = avg_rating
    WHERE DoctorID = id;
END;


--11
-- to store in logtable after updating a schedule time
CREATE OR REPLACE TRIGGER update_schedule_trigger
AFTER UPDATE OF starttime, endtime ON doctorschedule
FOR EACH ROW
DECLARE
    v_username VARCHAR2(100);
BEGIN
    SELECT FirstName || ' ' || LastName
    INTO v_username
    FROM DOCTOR
    WHERE DOCTORID = :NEW.DOCTORID;
    
    INSERT INTO LOGTABLE (PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME)
    VALUES ('updatescheduletime',
            'Old start time:=' || :OLD.STARTTIME || 
            ', Old end time:=' || :OLD.ENDTIME || 
            ', NEW start time:=' || :NEW.STARTTIME || 
            ', new end time:=' || :NEW.ENDTIME || 
            ', Old CAPACITY:=' || :OLD.CAPACITY || 
            ', NEW CAPACITY:=' || :NEW.CAPACITY, 
            :NEW.DOCTORID, v_username);
END update_schedule_trigger;

