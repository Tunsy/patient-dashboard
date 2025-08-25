import { gql } from "@apollo/client";

export const GET_PATIENTS_LIST = gql`
    query GetPatients {
        patients {
            id
            firstName
            lastName
            dob
            phone
            appointments {
                id
            }
        }
    }
`;

export const GET_APPOINTMENT_DETAILS = gql`
    query GetPatientById($id: String!) {
        patient(id: $id) {
            id
            firstName
            lastName
            dob
            email
            phone
            address
            appointments {
                id
                appointmentDate
                appointmentType
            }
        }
    }
`;