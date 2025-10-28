import React from 'react';
import AllCars from '../../components/user/AllCars';
import { Container } from 'react-bootstrap';

function GetAllCars() {
  return (
    <>
      <div className=" py-5 text-center" style={{marginTop:"100px"}}>
        <h2 className="fw-bold">Explore Our New Luxury Collections</h2>
        <p className="mt-2">Browse our curated list of premium cars, handpicked just for you.</p>
      </div>
      <Container className="my-5">
        <AllCars />
      </Container>
    </>
  );
}

export default GetAllCars;
