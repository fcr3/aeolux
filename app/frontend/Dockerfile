FROM node:alpine
RUN mkdir -p /src
WORKDIR /src
COPY ./package.json .
# RUN npm install -g \
#     @material-ui/core \
#     @material-ui/icons \
#     @material-ui/lab \
#     @testing-library/jest-dom@5.11.10 \
#     @testing-library/react@11.2.6 \
#     @testing-library/user-event@12.8.3 \
#     axios \
#     konva \
#     react@17.0.2 \
#     react-dom@17.0.2 \
#     react-konva@17.0.2-0 \
#     react-scripts@4.0.3 \
#     web-vitals@1.1.1
RUN npm install
COPY . .
CMD ["npm", "start"]
