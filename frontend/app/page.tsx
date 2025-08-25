"use client";
import { useQuery } from "@apollo/client";
import { GET_PATIENTS_LIST } from "@/graphql/queries";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BriefcaseMedical } from "lucide-react";

interface Appointment {
  id: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  phone: string;
  appointments: Appointment[];
}

export default function Home() {
  const { loading, error, data } = useQuery(GET_PATIENTS_LIST);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-800">Error: {error.message}</p>;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex gap-4 justify-center">
        <BriefcaseMedical className="h-8 w-8 text-gray-700" />
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Patient Dashboard</h1>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Appointments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.patients.map((patient: Patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link href={`/patients/${patient.id}`} className="text-blue-600 hover:underline">
                    {patient.firstName} {patient.lastName}
                  </Link>
                </TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.appointments.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}