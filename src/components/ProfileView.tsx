import React, { useState } from 'react';
import TeacherSearchByPinForm from './TPINForm';
import EditTeacherForm from './EditTeacherForm';

export default function ProfileView() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="space-y-6">
      <TeacherSearchByPinForm onVerify={() => setIsVerified(true)} label="Teacher PIN" />
      {isVerified && <EditTeacherForm />}
    </div>
  );
}
