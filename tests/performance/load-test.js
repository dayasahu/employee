/**
 * k6 performance test for the employee service.
 * Runs against the GREEN (preview) service before promotion.
 *
 * Thresholds (must pass to promote):
 *   - 99th percentile response time < 500ms
 *   - Error rate < 1%
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');
const BASE_URL = __ENV.BASE_URL || 'http://localhost:18080';

export const options = {
  stages: [
    { duration: '10s', target: 5  },   // ramp up to 5 users
    { duration: '20s', target: 10 },   // hold at 10 users
    { duration: '10s', target: 0  },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'],   // 99% of requests under 500ms
    http_req_failed:   ['rate<0.01'],   // less than 1% failure rate
    errors:            ['rate<0.01'],
  },
};

export default function () {

  // Test 1: /api/hello
  let res = http.get(`${BASE_URL}/api/hello`);
  const helloOk = check(res, {
    'hello: status 200':          (r) => r.status === 200,
    'hello: response time <200ms': (r) => r.timings.duration < 200,
    'hello: has body':             (r) => r.body.length > 0,
  });
  errorRate.add(!helloOk);
  sleep(0.5);

  // Test 2: /api/employees
  res = http.get(`${BASE_URL}/api/employees`);
  const employeesOk = check(res, {
    'employees: status 200':          (r) => r.status === 200,
    'employees: response time <300ms': (r) => r.timings.duration < 300,
    'employees: has body':             (r) => r.body.length > 0,
  });
  errorRate.add(!employeesOk);
  sleep(1);

  // Test 3: /actuator/health
  res = http.get(`${BASE_URL}/actuator/health`);
  check(res, {
    'health: status 200': (r) => r.status === 200,
  });
  sleep(0.5);
}
