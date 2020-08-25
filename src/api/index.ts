import express, { Router, Request, Response} from "express";
import auth from "./auth-router";
import patient from "./patient-router";
import user from "./user-router";
import doctor from "./doctor-router";
import department from "./department-router";
import hospital from "./hospital-router";
import staff from "./staff-router";
import appointment from "./appointment-router";
import medicalReport from "./medical-report-router";
import medicalRecord from "./medical-record-router";
import medicineMedicalRecord from "./medicine-medical-record-router";
import medicalExamination from "./medical-examination-router";
import feedback from "./feedback-router";
import momo from "./momo-router";
import paymentHistory from "./payment-history-router";

const routes = Router();

routes.use("/auth", auth);
routes.use("/patient", patient);
routes.use("/user", user);
routes.use("/doctor", doctor);
routes.use("/staff", staff);
routes.use("/momo", momo);

routes.use("/department", department);
routes.use("/hospital", hospital);

routes.use("/appointment", appointment);
routes.use("/medical-report", medicalReport);
routes.use("/medical-record", medicalRecord);
routes.use("/medical-examination", medicalExamination);
routes.use("/medicine-medical-record", medicineMedicalRecord);
routes.use("/feedback", feedback);
routes.use("/payment", paymentHistory);

routes.use('/uploads', express.static('./uploads'));

export default routes;
