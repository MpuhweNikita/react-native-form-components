
import React, { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

// Reusable input component: keep it OUTSIDE Index().
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric" | "decimal-pad" | "url";
  multiline?: boolean;
  maxLength?: number;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  maxLength,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
    </View>
  );
}

const initialInterests = ["Mobile Development", "AI", "Cybersecurity"];

export default function Index() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [decimal, setDecimal] = useState("");
  const [website, setWebsite] = useState("");
  const [search, setSearch] = useState("");
  const [bio, setBio] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("Software Development");
  const [interests, setInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  function showMessage(message: string) {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("Form", message);
    }
  }

  async function handleSubmit() {
    // Basic form validation
    if (!name.trim() || !email.trim() || !age.trim()) {
      showMessage("Please complete your name, email, and age.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    if (!Number.isFinite(Number(age)) || Number(age) <= 0) {
      showMessage("Age must be a positive number.");
      return;
    }

    if (website.trim() && !/^https?:\/\/\S+\.\S+/i.test(website.trim())) {
      showMessage("Enter a valid website starting with https:// or http://.");
      return;
    }

    if (!acceptedTerms) {
      showMessage("Please accept the terms before submitting.");
      return;
    }

    // Build the JSON object from the form values.
    // Never include the actual password in the console or request.
    const formData = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      passwordProvided: password.length > 0,
      phone: phone.trim(),
      age: Number(age),
      decimalValue: decimal.trim() ? Number(decimal) : null,
      website: website.trim(),
      search: search.trim(),
      bio: bio.trim(),
      date,
      time,
      gender,
      course,
      interests,
      experienceLevel: experience,
      quantity,
      acceptedTerms,
      notifications,
    };

    console.log("FORM DATA AS JSON:");
    console.log(JSON.stringify(formData, null, 2));

    setSubmitting(true);

    try {
      // JSONPlaceholder is a public testing API, not a real database.
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();

      console.log("SERVER RESPONSE:");
      console.log(JSON.stringify(result, null, 2));

      showMessage("Form submitted successfully to the test API!");
    } catch (error) {
      console.error("SUBMISSION ERROR:", error);
      showMessage(
        "The form data was logged, but the network request failed. Check your internet connection and console."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setPhone("");
    setAge("");
    setDecimal("");
    setWebsite("");
    setSearch("");
    setBio("");
    setDate("");
    setTime("");
    setGender("");
    setCourse("Software Development");
    setInterests([]);
    setExperience(5);
    setQuantity(1);
    setAcceptedTerms(false);
    setNotifications(true);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Complete Form Demo</Text>
      <Text style={styles.description}>
        Practise input fields, selection controls, validation, JSON, and API requests.
        Fields marked * are required.
      </Text>

      <Field label="Full name *" value={name} onChangeText={setName} />
      <Field label="Username" value={username} onChangeText={setUsername} />
      <Field
        label="Email *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="example@email.com"
      />

      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        placeholder="Enter a test password"
      />
      <View style={styles.switchRow}>
        <Text>Show password</Text>
        <Switch value={showPassword} onValueChange={setShowPassword} />
      </View>

      <Field
        label="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Field
        label="Age *"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Enter your age"
      />
      <Field
        label="Decimal number"
        value={decimal}
        onChangeText={setDecimal}
        keyboardType="decimal-pad"
        placeholder="Example: 12.5"
      />
      <Field
        label="Website URL"
        value={website}
        onChangeText={setWebsite}
        keyboardType="url"
        placeholder="https://example.com"
      />
      <Field
        label="Search"
        value={search}
        onChangeText={setSearch}
        placeholder="Search for something"
      />

      <Field
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        placeholder="2026-10-16"
      />
      <Field
        label="Time (HH:MM)"
        value={time}
        onChangeText={setTime}
        placeholder="14:30"
      />

      <Field
        label="Short biography"
        value={bio}
        onChangeText={setBio}
        multiline
        maxLength={200}
        placeholder="Tell us a little about yourself"
      />
      <Text style={styles.counter}>{bio.length}/200 characters</Text>

      <Text style={styles.label}>Gender (choose one)</Text>
      {["Female", "Male", "Prefer not to say"].map((option) => (
        <Pressable
          key={option}
          style={styles.option}
          onPress={() => setGender(option)}
        >
          <Text style={styles.optionText}>
            {gender === option ? "🔘" : "⚪"} {option}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Course (dropdown)</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={course} onValueChange={setCourse}>
          <Picker.Item label="Software Development" value="Software Development" />
          <Picker.Item label="Data Science" value="Data Science" />
          <Picker.Item label="Cybersecurity" value="Cybersecurity" />
          <Picker.Item label="Embedded Systems" value="Embedded Systems" />
        </Picker>
      </View>

      <Text style={styles.label}>Interests (choose multiple)</Text>
      {["Mobile Development", "AI", "Cybersecurity", "Robotics", "Web Development"].map(
        (interest) => (
          <Pressable
            key={interest}
            style={styles.option}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={styles.optionText}>
              {interests.includes(interest) ? "☑" : "☐"} {interest}
            </Text>
          </Pressable>
        )
      )}

      <Text style={styles.label}>Experience level: {experience}/10</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={experience}
        onValueChange={setExperience}
      />

      <Text style={styles.label}>Quantity</Text>
      <View style={styles.quantityRow}>
        <Pressable
          style={styles.quantityButton}
          onPress={() => setQuantity((value) => Math.max(1, value - 1))}
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>
        <Text style={styles.quantityValue}>{quantity}</Text>
        <Pressable
          style={styles.quantityButton}
          onPress={() => setQuantity((value) => value + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Accept terms *</Text>
        <Switch value={acceptedTerms} onValueChange={setAcceptedTerms} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Receive notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.buttonSpacing}>
        <Button
          title={submitting ? "Submitting..." : "Submit Form"}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </View>
      <View style={styles.buttonSpacing}>
        <Button title="Reset Form" onPress={resetForm} color="#555555" />
      </View>

      <Text style={styles.footer}>
        Check your terminal or browser console to view the JSON output.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  container: {
    padding: 20,
    paddingBottom: 50,
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#17365d",
    marginBottom: 8,
  },
  description: {
    color: "#555555",
    marginBottom: 20,
    lineHeight: 21,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 7,
    color: "#222222",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    color: "#111827",
  },
  multiline: {
    minHeight: 95,
    textAlignVertical: "top",
  },
  counter: {
    color: "#666666",
    textAlign: "right",
    marginTop: -7,
  },
  option: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginTop: 4,
    backgroundColor: "#ffffff",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#e0e6ee",
  },
  optionText: {
    fontSize: 15,
    color: "#222222",
  },
  pickerBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    overflow: "hidden",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingVertical: 5,
  },
  switchLabel: {
    flex: 1,
    marginRight: 12,
    color: "#222222",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "#17365d",
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 30,
  },
  buttonSpacing: {
    marginTop: 16,
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    color: "#555555",
    lineHeight: 20,
  },
});
