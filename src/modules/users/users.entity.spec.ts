import { User } from "./users.entity";
import { Security } from "../../utils/security.util";
import createCuid from "cuid";
import * as bcrypt from "bcrypt";
import { env } from "../../configs/env";

describe("UsersEntity", () => {
  it("should be defined", () => {
    const user = new User();
    expect(user).toBeDefined();
  });

  it("should create a new user", () => {
    const mockUserCreate = {
      firstName: "Tibia",
      lastName: "Info",
      username: "tibia-info",
      email: "contato@tibia-info.com",
      password: "@123asdf#",
      permissions: [],
    };

    const user = new User();
    user.create = mockUserCreate;

    expect(user).toBeDefined();

    validate(user, {
      ...mockUserCreate,
      username: Security.hash("tibia-info"),
      email: Security.hash("contato@tibia-info.com"),
    });
  });

  it("should update a user", () => {
    const mockUserCreate = {
      firstName: "Tibia",
      lastName: "Info",
      username: "tibia-info",
      email: "contato@tibia-info.com",
      password: "@123asdf#",
      permissions: [],
    };

    const user = new User();
    user.create = mockUserCreate;

    expect(user).toBeDefined();

    const mockUserUpdate = {
      firstName: "Tibia e",
      lastName: "Info e",
      username: "tibia-info-e",
      email: "contatoe@tibia-info.com",
    };

    user.update = mockUserUpdate;

    validate(user, {
      ...mockUserUpdate,
      username: Security.hash("tibia-info-e"),
      email: Security.hash("contatoe@tibia-info.com"),
    });
  });

  it("should set a user", () => {
    const mockUserSet = setUser();
    const user = new User(mockUserSet);
    validate(user, mockUserSet);
  });

  it("should user response", () => {
    const mockUserSet = setUser();

    const user = new User(mockUserSet);
    expect(user).toBeDefined();
    expect(user.response).toBeDefined();
    expect(user.response).toEqual({
      id: mockUserSet.id,
      createdAt: mockUserSet.createdAt,
      updatedAt: mockUserSet.updatedAt,
      disabledAt: mockUserSet.disabledAt,
      firstName: mockUserSet.firstName,
      lastName: mockUserSet.lastName,
      username: mockUserSet.usernameHash,
      email: mockUserSet.emailHash,
      pictureUri: mockUserSet.pictureUri,
      permissions: mockUserSet.permissions,
    });
  });

  it("should set username", () => {
    const userToJson = setUser();
    const user = new User(userToJson);
    expect(user).toBeDefined();
    expect(user.toJson.email).toBe(userToJson.email);
    user.username = "tibia-info-edit";
    expect(user.toJson.username).toBe(Security.hash("tibia-info-edit"));
    expect(user.toJson.username).not.toBe(userToJson.email);
    expect(user.toJson.usernameHash).toBeDefined();
    expect(user.toJson.usernameHash).not.toBe(userToJson.emailHash);
  });

  it("should set email", () => {
    const userToJson = setUser();
    const user = new User(userToJson);
    expect(user).toBeDefined();
    expect(user.toJson.email).toBe(userToJson.email);
    user.email = "contato-edit@tibia-info.com";
    expect(user.toJson.email).toBe(
      Security.hash("contato-edit@tibia-info.com"),
    );
    expect(user.toJson.email).not.toBe(userToJson.email);
    expect(user.toJson.emailHash).toBeDefined();
    expect(user.toJson.emailHash).not.toBe(userToJson.emailHash);
  });

  it("should set password", () => {
    const userToJson = setUser();
    const user = new User(userToJson);
    expect(user).toBeDefined();
    expect(user.toJson.passwordHash).toBe(userToJson.passwordHash);
    user.password = "!321qwer$";
    expect(user.toJson.passwordHash).toBeDefined();
    expect(user.toJson.passwordHash).not.toBe(userToJson.passwordHash);
    expect(
      bcrypt.compareSync("!321qwer$", user.toJson.passwordHash),
    ).toBeTruthy();
  });

  it("should set pictureUri", () => {
    const userToJson = setUser();
    const user = new User(userToJson);
    expect(user).toBeDefined();
    expect(user.toJson.pictureUri).toBe(userToJson.pictureUri);
    user.pictureUri = "/images/new-profile-picture.png";
    expect(user.toJson.pictureUri).toBe("/images/new-profile-picture.png");
    expect(user.toJson.pictureUri).not.toBe(userToJson.pictureUri);
  });
});

interface UserMockDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

function validate(
  user: User,
  userMock: UserMockDto,
  pictureUri: string = "/images/default-profile-picture.png",
): void {
  const userToJson = user.toJson;
  expect(userToJson).toBeDefined();
  expect(userToJson.id).toBeDefined();
  expect(userToJson.createdAt).toBeDefined();
  expect(userToJson.createdAt).toBeInstanceOf(Date);
  expect(userToJson.updatedAt).toBeDefined();
  expect(userToJson.updatedAt).toBeInstanceOf(Date);
  expect(userToJson.disabledAt).toBeNull();
  expect(userToJson.firstName).toBe(userMock.firstName);
  expect(userToJson.lastName).toBe(userMock.lastName);
  expect(userToJson.username).toBe(userMock.username);
  expect(userToJson.usernameHash).toBeDefined();
  expect(userToJson.email).toBe(userMock.email);
  expect(userToJson.emailHash).toBeDefined();
  expect(userToJson.passwordHash).toBeDefined();
  expect(userToJson.pictureUri).toBe(pictureUri);
}

function setUser() {
  const salt = bcrypt.genSaltSync(env.SALT_OR_ROUNDS);
  const passwordHash = bcrypt.hashSync("@123asdf#", salt);
  const mockUserSet = {
    id: createCuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    disabledAt: null,
    firstName: "Tibia",
    lastName: "Info",
    username: Security.hash("tibia-info"),
    usernameHash: Security.encrypt("tibia-info"),
    email: Security.hash("contato@tibia-info.com"),
    emailHash: Security.encrypt("contato@tibia-info.com"),
    passwordHash: passwordHash,
    pictureUri: "/images/default-profile-picture.png",
    permissions: [],
  };
  const user = new User(mockUserSet);
  expect(user).toBeDefined();
  expect(user.toJson).toBeDefined();
  return user.toJson;
}
