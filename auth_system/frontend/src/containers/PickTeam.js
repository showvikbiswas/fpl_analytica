import React from "react";

const PickTeam = () => {
  return (
    <div class="d-flex justify-content-center">
      <div className="p-2 flex-grow-2">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Players</th>
              <th scope="col">Position</th>
              <th scope="col">Gameweek Points</th>
              <th scope="col">Total Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p2 flex-grow-1">
        <p></p>
      </div>
    </div>
  );
};

export default PickTeam;
