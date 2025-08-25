"use client";
import { useQuery } from "@apollo/client";
import { GET_APPOINTMENT_DETAILS } from "@/graphql/queries";
import Link from "next/link";
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cake, Mail, Phone, Home } from "lucide-react";

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentType: string;
}


export default function AppointmentDetailPage() {
  const params = useParams();
  const { id } = params;

  const { loading, error, data } = useQuery(GET_APPOINTMENT_DETAILS, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-800">Error: {error.message}</p>;
  if (!data || !data.patient) return <p className="text-center mt-8">Patient not found.</p>;

  const { patient } = data;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/" className="gap-4">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-4 text-center">{patient.firstName} {patient.lastName}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">
            <div className="flex items-center gap-4">
              <Cake className="h-5 w-5" />
              <p>{patient.dob || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5" />
              <p>{patient.email || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5" />
              <p>{patient.phone || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Home className="h-5 w-5" />
              <p>{patient.address || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patient.appointments.length > 0 ? (
              patient.appointments.map((appt: Appointment) => (
                <TableRow key={appt.id}>
                  <TableCell>{appt.appointmentDate || 'N/A'}</TableCell>
                  <TableCell>{appt.appointmentType || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">No appointments found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}