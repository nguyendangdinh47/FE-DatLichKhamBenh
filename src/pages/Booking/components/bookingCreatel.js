import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookingApi from '../../../api/bookingApi';
import patientApi from '../../../api/patientApi';
import ImageRatio from '../../../components/ImageRatio';
import { API_HOST_STATIC } from '../../../constants';
import { formatPriceVN } from '../../../utils';

function BookingCreatePage() {
  const [validated, setValidated] = useState(false);
  const history = useHistory();
  const [userLogin, setPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const { schedule, doctor, item } = history?.location?.state?.data;
  const id = JSON.parse(localStorage.getItem('user'))?.Patient?.id || null;
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await patientApi.getById(id);
        setPatient(data.data);
        setLoading(false);
      } catch (error) {
        console.log('Failed to fetch patient', error);
      }
      setLoading(false);
    })();
  }, [id]);

  if (!schedule || !doctor || !item) return history.push('/');
  const isCheckUser = !!userLogin?.fullName && !!userLogin?.email && !!userLogin?.phone;
  const image = `${API_HOST_STATIC}${doctor?.avatarImage}`;

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === false) return;

    const value = {};
    value.reasonExamination = reason;
    value.patientId = userLogin?.id;
    value.dateBooking = schedule?.workingDay;
    value.timeSlotId = item.id;

    value.email = userLogin.email;
    value.patientName = userLogin.fullName;
    value.value = item.value;
    value.doctorName = doctor.fullName;
    value.status = 'UNCOMFIRMED';
    try {
      setLoading(true);
      const data = await bookingApi.create(value);
      setLoading(false);
      if (data)
        toast.success('?????t l???ch kh??m th??nh c??ng! Vui l??ng ki???m tra email ????? x??c nh???n th??ng tin');
      // history.push('/');
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="container-md" style={{ width: 1140 }}>
      <h4 className="text-center mt-3">?????t l???ch kh??m</h4>
      <Card className="p-4 mx-auto" style={{ maxWidth: 700 }}>
        <div className="d-flex">
          <div style={{ width: 120 }}>
            <ImageRatio ratio={'1x1'} src={image} style={{ objectFit: 'cover' }} />
          </div>
          <div className="ms-4">
            <h5>
              {doctor.Position.positionName} - {doctor.fullName}
            </h5>
            <p>{doctor.clinicName}</p>
            <p>Chuy??n khoa {doctor.Specialist.specialistName}</p>
            <div className="mt-2">
              <div className="badge bg-primary p-2 me-2">
                <i class="bi bi-alarm me-1"></i>
                {item.value}
              </div>
              <div className="badge bg-info p-2 me-2">
                <i class="bi bi-calendar me-1"></i>
                {moment.unix(schedule.workingDay / 1000).format('DD MMM YYYY')}
              </div>
              <div className="badge bg-secondary p-2">
                <i class="bi bi-cash me-1"></i>
                {formatPriceVN(schedule.priceTimeSlot)}
              </div>
            </div>
          </div>
        </div>
        <div>
          {!!id ? (
            isCheckUser ? (
              <div className="mt-4">
                <b className="fs-6 my-3">Th??ng tin ng?????i ?????t l???ch</b>
                <div class="row mt-3">
                  <div class="col-3 text-muted">H??? v?? t??n </div>
                  <div class="col fw-bolder">
                    {' '}
                    <small>{userLogin?.fullName}</small>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 text-muted fs-6">S??? ??i???n tho???i </div>
                  <div class="col ">
                    <small>{userLogin?.phone}</small>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 text-muted">Email </div>
                  <div class="col">
                    {' '}
                    <small>{userLogin?.email}</small>
                  </div>
                </div>
                <Form noValidate onSubmit={handleSubmit} validated={validated}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Group as={Col} controlId="validationCustom03">
                      <Form.Label>
                        L?? do kh??m b???nh <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        style={{ height: 80 }}
                        as="textarea"
                        rows={3}
                        required
                        name="reasonExamination"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui l??ng nh???p l?? do kh??m b???nh
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button className="bg-primary w-100 mt-2" type="submit" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm"></Spinner> : '?????t ngay'}
                    </Button>
                  </Form.Group>
                  <i className="text-muted ">
                    <small>Chi ph?? ?????t l???ch mi???n ph??</small>
                  </i>
                </Form>
              </div>
            ) : (
              <>
                <Alert className="mt-2" variant="warning">
                  Vui l??ng c???p nh???t th??ng tin tr?????c khi ?????t l???ch{' '}
                  <Button
                    className="w-100 mt-4 d-inline"
                    variant="primary"
                    onClick={() => history.push(`/profile/${userLogin.id}`)}
                    as="span"
                  >
                    C???p nh???t ngay <i class="bi bi-arrow-right"></i>
                  </Button>
                </Alert>
              </>
            )
          ) : (
            <Button className="w-100 mt-4" onClick={() => history.push('/login')}>
              ????ng nh???p ngay ????? ?????t l???ch
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default BookingCreatePage;
